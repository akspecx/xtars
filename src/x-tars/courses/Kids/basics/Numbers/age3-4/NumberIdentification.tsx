// import React, { useState, useEffect, useCallback, useMemo } from 'react';

// interface NumberCard {
//   number: number;
//   word: string;
//   color: string;
//   gradient: string;
//   apples: number;
// }

// interface AppleGroup {
//   id: string;
//   apples: number;
// }

// const numberData: NumberCard[] = [
//   { number: 1, word: 'One', color: 'text-green-600', gradient: 'from-green-400 to-emerald-500', apples: 1 },
//   { number: 2, word: 'Two', color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500', apples: 2 },
//   { number: 3, word: 'Three', color: 'text-pink-600', gradient: 'from-pink-400 to-rose-500', apples: 3 },
//   { number: 4, word: 'Four', color: 'text-amber-700', gradient: 'from-amber-400 to-orange-500', apples: 4 },
//   { number: 5, word: 'Five', color: 'text-purple-600', gradient: 'from-purple-400 to-violet-500', apples: 5 },
//   { number: 6, word: 'Six', color: 'text-indigo-600', gradient: 'from-indigo-400 to-blue-500', apples: 6 },
//   { number: 7, word: 'Seven', color: 'text-teal-600', gradient: 'from-teal-400 to-cyan-500', apples: 7 },
//   { number: 8, word: 'Eight', color: 'text-red-600', gradient: 'from-red-400 to-pink-500', apples: 8 },
//   { number: 9, word: 'Nine', color: 'text-violet-600', gradient: 'from-violet-400 to-purple-500', apples: 9 },
//   { number: 10, word: 'Ten', color: 'text-sky-600', gradient: 'from-sky-400 to-blue-500', apples: 10 },
// ];

// const NumberIdentification: React.FC = () => {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
//   const [selectedAppleGroup, setSelectedAppleGroup] = useState<AppleGroup | null>(null);
//   const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
//   const [shuffledAppleGroups, setShuffledAppleGroups] = useState<AppleGroup[]>([]);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
//   const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
//   const [score, setScore] = useState(0);
//   const [attempts, setAttempts] = useState(0);

//   const welcomeMessage = "Welcome! Identify and match each number with the correct group of apples. Click a number, then click the matching apple group.";

//   const numberCardMap = useMemo(() => {
//     const map = new Map<number, NumberCard>();
//     numberData.forEach((item) => {
//       map.set(item.number, item);
//     });
//     return map;
//   }, []);

//   const speak = useCallback(
//     (text: string) => {
//       if (
//         typeof window !== 'undefined' &&
//         'speechSynthesis' in window &&
//         typeof SpeechSynthesisUtterance !== 'undefined' &&
//         !isSpeaking
//       ) {
//         setIsSpeaking(true);
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.rate = 0.8;
//         utterance.pitch = 1.2;
//         utterance.volume = 0.8;
//         utterance.onend = () => setIsSpeaking(false);
//         window.speechSynthesis.speak(utterance);
//       }
//     },
//     [isSpeaking]
//   );

//   const initializeGame = useCallback(() => {
//     const groups = numberData.map((item, index) => ({
//       id: `${item.number}-${index}`,
//       apples: item.apples,
//     }));
//     const shuffled = [...groups].sort(() => Math.random() - 0.5);
//     setShuffledAppleGroups(shuffled);
//     setMatchedPairs(new Set());
//     setSelectedNumber(null);
//     setSelectedAppleGroup(null);
//     setGameStarted(true);
//     setShowSuccess(false);
//     setScore(0);
//     setAttempts(0);
//   }, []);

//   useEffect(() => {
//     if (!gameStarted) {
//       initializeGame();
//     }
//   }, [gameStarted, initializeGame]);

//   const handlePlayInstructions = () => {
//     speak(welcomeMessage);
//   };

//   const handleNumberClick = (number: number) => {
//     if (matchedPairs.has(number)) return;

//     if (selectedNumber === number) {
//       setSelectedNumber(null);
//     } else {
//       setSelectedNumber(number);
//       setSelectedAppleGroup(null);
//       const word = numberCardMap.get(number)?.word || '';
//       speak(`You selected number ${number}, ${word}. Now click the group with ${number} apples.`);
//     }
//   };

//   const handleAppleGroupClick = (group: AppleGroup) => {
//     if (!selectedNumber) {
//       speak("Please select a number first!");
//       return;
//     }

//     setAttempts(prev => prev + 1);
//     const correctCount = numberCardMap.get(selectedNumber)?.apples;
//     if (correctCount === undefined) {
//       return;
//     }

//     if (group.apples === correctCount) {
//       setMatchedPairs(prev => {
//         const next = new Set(prev);
//         next.add(selectedNumber);
//         return next;
//       });
//       setScore(prev => prev + 10);
//       setShowCorrectAnimation(true);
//       const word = numberCardMap.get(selectedNumber)?.word || '';
//       speak(`Excellent! ${selectedNumber} matches with ${group.apples} apples! ${word}!`);

//       setTimeout(() => {
//         setShowCorrectAnimation(false);
//       }, 1000);

//       setSelectedNumber(null);
//       setSelectedAppleGroup(null);

//       if (matchedPairs.size + 1 === numberData.length) {
//         setTimeout(() => {
//           setShowSuccess(true);
//           speak("Amazing! You matched all the numbers correctly! Great job!");
//         }, 800);
//       }
//     } else {
//       setShowIncorrectAnimation(true);
//       speak(`Oops! That's not correct. Number ${selectedNumber} should match with ${correctCount} apples. Try again!`);
//       setSelectedAppleGroup(group);

//       setTimeout(() => {
//         setShowIncorrectAnimation(false);
//         setSelectedAppleGroup(null);
//       }, 1200);
//     }
//   };

//   const handleReset = () => {
//     initializeGame();
//   };

//   const renderApples = (count: number, isMatched: boolean = false) => {
//     return Array.from({ length: count }, (_, i) => (
//       <span 
//         key={i} 
//         className={`text-2xl sm:text-3xl transition-all duration-300 ${
//           isMatched ? 'animate-bounce' : 'hover:scale-125'
//         }`}
//         style={{ 
//           animationDelay: isMatched ? `${i * 0.1}s` : '0s',
//           display: 'inline-block'
//         }}
//       >
//         🍎
//       </span>
//     ));
//   };

//   const progress = (matchedPairs.size / numberData.length) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-yellow-50 p-4 sm:p-8 relative overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="text-center mb-8 sm:mb-12">
//           <div className="inline-block mb-4">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
//               Identify and Match the Correct Numbers
//             </h1>
//             <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
//           </div>
//           <p className="text-lg sm:text-xl text-gray-700 font-medium">Identify and Match each number with the correct group of apples!</p>
          
//           <div className="mt-6 max-w-md mx-auto">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-semibold text-gray-700">Progress</span>
//               <span className="text-sm font-bold text-green-600">{matchedPairs.size} / {numberData.length}</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
//               <div 
//                 className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-lg"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-center gap-6">
//             <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-green-200">
//               <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Score</div>
//               <div className="text-2xl font-bold text-green-600">{score}</div>
//             </div>
//             <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-blue-200">
//               <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Attempts</div>
//               <div className="text-2xl font-bold text-blue-600">{attempts}</div>
//             </div>
//           </div>
//         </div>

//         {showSuccess && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
//             <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-md mx-4 transform animate-scaleIn border-4 border-green-400">
//               <div className="text-7xl mb-6 animate-bounce">🎉</div>
//               <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
//                 Congratulations!
//               </h2>
//               <p className="text-xl text-gray-700 mb-2 font-medium">You matched all the numbers correctly!</p>
//               <p className="text-lg text-gray-600 mb-8">Final Score: <span className="font-bold text-green-600">{score}</span> points</p>
//               <button
//                 onClick={handleReset}
//                 className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 Play Again
//               </button>
//             </div>
//           </div>
//         )}

//         {showCorrectAnimation && (
//           <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
//             <div className="text-8xl animate-ping">✓</div>
//           </div>
//         )}
//         {showIncorrectAnimation && (
//           <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
//             <div className="text-8xl text-red-500 animate-pulse">✗</div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">Numbers</h2>
//               <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
//               {numberData.map((item) => {
//                 const isMatched = matchedPairs.has(item.number);
//                 const isSelected = selectedNumber === item.number;
                
//                 return (
//                   <div
//                     key={item.number}
//                     onClick={() => handleNumberClick(item.number)}
//                     className={`
//                       relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer 
//                       transition-all duration-300 transform
//                       ${isMatched 
//                         ? 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-500 opacity-70 scale-95' 
//                         : isSelected
//                         ? `bg-gradient-to-br ${item.gradient} border-4 border-blue-500 scale-110 shadow-2xl ring-4 ring-blue-300`
//                         : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-xl hover:scale-105 active:scale-95'
//                       }
//                     `}
//                   >
//                     {isSelected && (
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
//                         <span className="text-white text-sm font-bold">✓</span>
//                       </div>
//                     )}
//                     <div className={`text-5xl sm:text-6xl font-extrabold mb-2 text-center ${item.color} drop-shadow-md`}>
//                       {item.number}
//                     </div>
//                     <div className={`text-base sm:text-lg font-bold text-center ${item.color} opacity-90`}>
//                       {item.word}
//                     </div>
//                     {isMatched && (
//                       <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl">
//                         <div className="text-4xl animate-bounce">✓</div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-3xl font-bold text-gray-800 mb-2">Apple Groups</h2>
//               <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
//               {shuffledAppleGroups.map((group) => {
//                 const isSelected = selectedAppleGroup?.id === group.id;
//                 const matchedNumber = Array.from(matchedPairs).find(num => 
//                   numberCardMap.get(num)?.apples === group.apples
//                 );
//                 const isMatched = matchedNumber !== undefined;
                
//                 return (
//                   <div
//                     key={group.id}
//                     onClick={() => handleAppleGroupClick(group)}
//                     className={`
//                       relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer 
//                       transition-all duration-300 transform
//                       ${isMatched
//                         ? 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-500 opacity-70 scale-95'
//                         : isSelected
//                         ? 'bg-gradient-to-br from-red-200 to-pink-300 border-4 border-red-500 scale-110 shadow-2xl ring-4 ring-red-300 animate-shake'
//                         : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-xl hover:scale-105 active:scale-95'
//                       }
//                     `}
//                   >
//                     {isSelected && (
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
//                         <span className="text-white text-sm font-bold">?</span>
//                       </div>
//                     )}
//                     <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 min-h-[70px] sm:min-h-[90px]">
//                       {renderApples(group.apples, isMatched)}
//                     </div>
//                     {isMatched && (
//                       <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl">
//                         <div className="text-4xl animate-bounce">✓</div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         <div className="mt-10 sm:mt-12 text-center space-y-6">
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-2xl mx-auto">
//             <p className="text-gray-700 text-base sm:text-lg font-medium">
//               💡 <span className="font-semibold">How to play:</span> Click a number, then click the matching apple group!
//             </p>
//             <button
//               onClick={handlePlayInstructions}
//               className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-base hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               <span>🔊</span>
//               <span>Play Instructions</span>
//             </button>
//           </div>
//           <button
//             onClick={handleReset}
//             className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
//           >
//             🔄 Reset Game
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         @keyframes scaleIn {
//           from { transform: scale(0.8); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.3s ease-out;
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-10px); }
//           75% { transform: translateX(10px); }
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NumberIdentification;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 Trophy, RefreshCcw, AlertCircle,
 CheckCircle2, Check, Hand, Sparkles,
 Play, MousePointer2, Timer,
 ChevronRight, Shuffle, XCircle, FastForward
} from 'lucide-react';

// --- Constants & Data ---
const COLORS = [
 '#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#264653',
 '#6d597a', '#b56576', '#fb8b24', '#3f37c9', '#4cc9f0'
];

const NUMBERS = Array.from({ length: 10 }, (_, i) => ({
 value: i + 1,
 color: COLORS[i],
}));

export default function App() {
 const [mode, setMode] = useState('practice'); 
 const [currentTarget, setCurrentTarget] = useState(null);
 const [options, setOptions] = useState([]);
 const [score, setScore] = useState(0);
 const [selectedIdx, setSelectedIdx] = useState(null);
 const [isAnswered, setIsAnswered] = useState(false);
 const [isCorrect, setIsCorrect] = useState(false);
 const [introStep, setIntroStep] = useState(0); 
 const [isIntroMode, setIsIntroMode] = useState(false);
 const [autoNextTimer, setAutoNextTimer] = useState(null);
 const [isAutoPlaying, setIsAutoPlaying] = useState(false);
 const [virtualHandPos, setVirtualHandPos] = useState(null);
 
 const introTimeoutRef = useRef(null);
 const timerIntervalRef = useRef(null);
 const optionsRefs = useRef([]);

 // Initialize first target
 useEffect(() => {
   const first = NUMBERS[0];
   setCurrentTarget(first);
   generateOptions(first.value);
   startIntroSequence(first);
   return () => {
     if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
   };
 }, [mode]);

 // Auto-next Timer logic
 useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
        timerIntervalRef.current = setInterval(() => {
            setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    } else if (autoNextTimer === 0) {
        handleNextSequential();
    }
    return () => clearInterval(timerIntervalRef.current);
 }, [autoNextTimer]);

 const generateOptions = (correctValue) => {
    let wrong1 = Math.floor(Math.random() * 10) + 1;
    while(wrong1 === correctValue) wrong1 = Math.floor(Math.random() * 10) + 1;
    
    let wrong2 = Math.floor(Math.random() * 10) + 1;
    while(wrong2 === correctValue || wrong2 === wrong1) wrong2 = Math.floor(Math.random() * 10) + 1;

    const newOptions = [
        { value: correctValue, isCorrect: true },
        { value: wrong1, isCorrect: false },
        { value: wrong2, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    setOptions(newOptions);
 };

 const speak = (text) => {
   if ('speechSynthesis' in window) {
     window.speechSynthesis.cancel();
     const utterance = new SpeechSynthesisUtterance(text);
     utterance.rate = 0.85; 
     utterance.pitch = 1.2;
     window.speechSynthesis.speak(utterance);
   }
 };

 const startIntroSequence = (target) => {
    setIsIntroMode(true);
    setIntroStep(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedIdx(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    
    const runStep = (current) => {
        if (current < target.value) {
            const next = current + 1;
            setIntroStep(next);
            speak(`${next}`);
            introTimeoutRef.current = setTimeout(() => runStep(next), 1200);
        } else {
            if (mode === 'kid') {
                speak(`That's ${target.value}! Now watch how we find the correct group.`);
                setTimeout(() => startKidModeTutorial(target.value), 2000);
            } else {
                speak(`Can you find the group that has ${target.value} apples?`);
                setIsIntroMode(false);
            }
        }
    };

    setTimeout(() => {
        speak(`Let's match number ${target.value}.`);
        setTimeout(() => runStep(0), 1000);
    }, 500);
 };

 // KID MODE AUTOMATED TUTORIAL
 const startKidModeTutorial = async (correctValue) => {
    setIsAutoPlaying(true);
    const shouldFailFirst = Math.random() > 0.4; 

    if (shouldFailFirst) {
        const wrongIdx = options.findIndex(o => !o.isCorrect);
        await moveHandToOption(wrongIdx);
        setSelectedIdx(wrongIdx);
        speak(`Is this group the right one? Let's see...`);
        setIsAnswered(true);
        setIsCorrect(false);
        await new Promise(r => setTimeout(r, 2500));
        setIsAnswered(false);
        setSelectedIdx(null);
        await new Promise(r => setTimeout(r, 800));
    }

    const correctIdx = options.findIndex(o => o.isCorrect);
    await moveHandToOption(correctIdx);
    setSelectedIdx(correctIdx);
    speak(`Look! This group has exactly ${correctValue} apples. This is the match!`);
    handleSelect(correctIdx);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
 };

 const moveHandToOption = (idx) => {
    return new Promise(resolve => {
        if (!optionsRefs.current[idx]) return resolve();
        const rect = optionsRefs.current[idx].getBoundingClientRect();
        setVirtualHandPos({ x: rect.left + rect.width/2, y: rect.top + rect.height/2 });
        setTimeout(resolve, 1500);
    });
 };

 const handleSelect = (idx) => {
    if (isIntroMode && mode === 'practice') return;
    if (isAnswered && isCorrect) return;

    setSelectedIdx(idx);
    setIsAnswered(true);
    const selected = options[idx];

    if (selected.isCorrect) {
        setIsCorrect(true);
        setScore(s => s + 1);
        speak(`Wonderful! Number ${selected.value} matches perfectly.`);
        setAutoNextTimer(10);
    } else {
        setIsCorrect(false);
        speak(`Not quite. This group has ${selected.value} apples. Try again!`);
        if (!isAutoPlaying) {
            setTimeout(() => {
                setIsAnswered(false);
                setSelectedIdx(null);
            }, 2000);
        }
    }
 };

 const handleNextSequential = () => {
    clearInterval(timerIntervalRef.current);
    setAutoNextTimer(null);
    const currentIndex = NUMBERS.findIndex(n => n.value === currentTarget.value);
    const nextIndex = (currentIndex + 1) % NUMBERS.length;
    const nextTarget = NUMBERS[nextIndex];
    setCurrentTarget(nextTarget);
    generateOptions(nextTarget.value);
    startIntroSequence(nextTarget);
 };

 const handleNextRandom = () => {
    clearInterval(timerIntervalRef.current);
    setAutoNextTimer(null);
    const available = NUMBERS.filter(n => n.value !== currentTarget.value);
    const random = available[Math.floor(Math.random() * available.length)];
    setCurrentTarget(random);
    generateOptions(random.value);
    startIntroSequence(random);
 };

 const resetGame = () => {
   setScore(0);
   const first = NUMBERS[0];
   setCurrentTarget(first);
   generateOptions(first.value);
   startIntroSequence(first);
 };

 return (
   <div className="min-h-screen bg-[#fcfaf7] p-3 sm:p-6 md:p-8 font-sans select-none overflow-x-hidden relative flex flex-col items-center text-[#4e342e]">
    
     {/* Header Section */}
     <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 mb-6 md:mb-8 px-2">
       <div className="flex flex-col items-center md:items-start text-center md:text-left">
           <h1 className="text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-2 sm:gap-3">
               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#bc4749] rounded-xl shadow-lg flex items-center justify-center text-white text-xl sm:text-2xl border-b-4 border-black/10">🍎</div>
               <span>Matching Lab</span>
           </h1>
           <p className="text-[10px] sm:text-xs font-bold text-[#8d6e63] mt-1 opacity-80 uppercase tracking-widest">Mastering Quantities</p>
       </div>

       <div className="bg-[#e2d6c3] p-1 rounded-xl sm:p-1.5 sm:rounded-2xl shadow-inner flex items-center gap-1 sm:gap-2 border border-stone-300">
          <button 
            onClick={() => setMode('kid')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all ${mode === 'kid' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Play size={12} fill={mode === 'kid' ? 'currentColor' : 'none'} className="sm:w-3.5 sm:h-3.5" />
            KID MODE
          </button>
          <button 
            onClick={() => setMode('practice')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <MousePointer2 size={12} fill={mode === 'practice' ? 'currentColor' : 'none'} className="sm:w-3.5 sm:h-3.5" />
            PRACTICE
          </button>
       </div>
      
       <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-1 sm:px-6 sm:py-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[70px]">
               <span className="text-[8px] sm:text-[10px] uppercase font-black opacity-40">Score</span>
               <span className="text-xl sm:text-2xl font-black">{score}</span>
           </div>
           <button onClick={resetGame} className="p-3 sm:p-4 bg-[#8d6e63] text-white rounded-xl hover:bg-[#5d4037] shadow-md border-b-4 border-[#5d4037]">
               <RefreshCcw size={18} className="sm:w-5 sm:h-5" />
           </button>
       </div>
     </div>

     {/* THE CHALLENGE BOARD */}
     <div className="w-full max-w-6xl bg-[#dfc4a1] rounded-[2rem] sm:rounded-[3rem] md:rounded-[5rem] p-4 sm:p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b-[12px] sm:border-b-[16px] md:border-b-[24px] border-[#c4a484] relative mb-6 sm:mb-10 overflow-hidden text-slate-900">
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-stretch">
            {/* LEFT: Target Card */}
            <div className="bg-white/50 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex flex-col items-center justify-center border-2 border-dashed border-[#8d6e63]/30 shadow-inner relative min-h-[280px] sm:min-h-[400px]">
                <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 bg-[#bc4749] px-4 py-1 rounded-full text-white font-black text-[9px] sm:text-xs tracking-widest uppercase">
                    Goal Number
                </div>
                
                <div className="flex flex-col items-center gap-2 sm:gap-4 mt-4 sm:mt-8">
                    <motion.span 
                        key={currentTarget?.value}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[7rem] sm:text-[10rem] md:text-[16rem] font-black leading-none drop-shadow-2xl"
                        style={{ color: currentTarget?.color }}
                    >
                        {currentTarget?.value}
                    </motion.span>
                    
                    <div className="bg-white/40 px-4 py-2 sm:px-8 sm:py-3 rounded-xl sm:rounded-2xl flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-xs min-h-[50px] sm:min-h-[60px]">
                        {Array.from({ length: currentTarget?.value || 0 }).map((_, i) => (
                             <AnimatePresence key={i}>
                                {i < introStep && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl sm:text-3xl">🍎</motion.span>
                                )}
                             </AnimatePresence>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Options List */}
            <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                <h3 className="text-[#5d4037] font-black text-center uppercase tracking-[0.2em] text-[10px] sm:text-sm mb-1 opacity-60">Which group matches?</h3>
                {options.map((opt, idx) => (
                    <motion.button
                        key={`${currentTarget?.value}-${idx}`}
                        ref={el => optionsRefs.current[idx] = el}
                        onClick={() => handleSelect(idx)}
                        disabled={(isIntroMode && !isAutoPlaying) || (isAnswered && isCorrect)}
                        whileHover={!isAnswered ? { scale: 1.01, x: 5 } : {}}
                        className={`relative w-full p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 transition-all flex items-center justify-between overflow-hidden shadow-lg ${
                            selectedIdx === idx 
                                ? (opt.isCorrect ? 'bg-emerald-100 border-emerald-500' : 'bg-rose-100 border-rose-500 animate-shake')
                                : 'bg-white/80 border-transparent hover:border-stone-200'
                        }`}
                    >
                        <div className="flex flex-wrap gap-1 sm:gap-2 max-w-[85%]">
                            {Array.from({ length: opt.value }).map((_, i) => (
                                <span key={i} className="text-xl sm:text-3xl md:text-4xl drop-shadow-sm">🍎</span>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedIdx === idx && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    {opt.isCorrect ? (
                                        <CheckCircle2 className="text-emerald-600 w-8 h-8 sm:w-12 sm:h-12" />
                                    ) : (
                                        <XCircle className="text-rose-600 w-8 h-8 sm:w-12 sm:h-12" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>
       </div>
     </div>

     {/* VIRTUAL HAND FOR KID MODE */}
     <AnimatePresence>
        {mode === 'kid' && virtualHandPos && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: 1,
                    left: virtualHandPos.x,
                    top: virtualHandPos.y
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                style={{ position: 'fixed' }}
            >
                <div className="relative">
                    <Hand size={60} fill="white" className="text-stone-800 sm:w-20 sm:h-20" />
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute inset-0 bg-white/30 rounded-full blur-xl"
                    />
                </div>
            </motion.div>
        )}
     </AnimatePresence>

     {/* BOTTOM NAVIGATION */}
     <div className="w-full max-w-5xl flex flex-col gap-6 sm:gap-10 mt-2 sm:mt-6 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="flex flex-col gap-1.5 sm:gap-2">
                <button 
                    onClick={handleNextSequential}
                    className={`group relative flex items-center justify-between w-full p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-base sm:text-xl transition-all active:scale-95 shadow-xl border-b-6 sm:border-b-8 ${
                        autoNextTimer !== null 
                        ? 'bg-emerald-600 text-white border-emerald-800' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
                    }`}
                >
                    <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                        <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="leading-tight text-sm sm:text-xl">
                                {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT LESSON'}
                            </span>
                            {autoNextTimer !== null && (
                                <span className="text-[8px] sm:text-[10px] opacity-70 tracking-widest uppercase">Moving to next section</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center relative z-10">
                        {autoNextTimer !== null ? (
                            <div className="flex items-center gap-2 sm:gap-3 bg-black/20 px-3 py-1 sm:px-5 sm:py-2 rounded-2xl sm:rounded-3xl border border-white/10">
                                <Timer size={18} className="animate-spin text-emerald-200 sm:w-6 sm:h-6" />
                                <span className="text-xl sm:text-4xl font-mono leading-none">{autoNextTimer}</span>
                            </div>
                        ) : (
                            <FastForward size={20} className="opacity-40 group-hover:opacity-100 transition-opacity sm:w-6 sm:h-6" />
                        )}
                    </div>

                    {autoNextTimer !== null && (
                        <motion.div 
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 10, ease: 'linear' }}
                            className="absolute inset-0 bg-emerald-700/30 rounded-[1.5rem] sm:rounded-[2.5rem] pointer-events-none"
                        />
                    )}
                </button>
                <p className="text-center text-[8px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">Proceed sequentially (1 to 10)</p>
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2">
                <button 
                    onClick={handleNextRandom}
                    className={`flex items-center justify-center gap-3 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-base sm:text-xl transition-all active:scale-95 shadow-xl border-b-6 sm:border-b-8 border-[#5d4037]`}
                >
                    <Shuffle size={20} className="sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-xl">NEXT RANDOM</span>
                </button>
                <p className="text-center text-[8px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">Jump to a surprise target</p>
            </div>
        </div>
     </div>

     {/* WINNING OVERLAY */}
     <AnimatePresence>
       {score >= 15 && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 text-slate-900">
           <motion.div
             initial={{ scale: 0.8 }} animate={{ scale: 1 }}
             className="bg-white rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-12 max-w-xs sm:max-w-md w-full text-center shadow-2xl border-t-[12px] sm:border-t-[16px] border-[#1b4332]"
           >
             <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#ebf2ef] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
               <Trophy className="text-[#1b4332] w-8 h-8 sm:w-14 sm:h-14" />
             </div>
             <h2 className="text-3xl sm:text-5xl font-black text-[#5d4037] mb-3 sm:mb-4">Master Matcher!</h2>
             <p className="text-[#8d6e63] mb-8 text-sm sm:text-lg leading-relaxed">You have perfectly identified every apple group! Ready for more?</p>
             <button
               onClick={resetGame}
               className="w-full py-4 sm:py-5 bg-[#1b4332] text-white rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-2xl hover:bg-[#081c15] shadow-xl border-b-6 sm:border-b-8 border-[#081c15]"
             >
               RESTART LAB
             </button>
           </motion.div>
         </div>
       )}
     </AnimatePresence>

     <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out 2; }
     `}</style>
   </div>
 );
}