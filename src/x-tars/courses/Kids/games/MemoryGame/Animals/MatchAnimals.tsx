// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import { RefreshCw, CheckCircle, XCircle, Heart, Sparkles, Sun, Moon, Volume2 } from 'lucide-react';

// // --- Data Definitions ---
// interface Animal {
//   id: string;
//   name: string;
//   emoji: string;
//   color: string; // Tailwind color class for styling
//   darkColor: string; // Tailwind dark color class for styling
// }

// // Static list of 24 unique animals for high variety
// const ALL_ANIMALS: Animal[] = [
//   { id: 'lion', name: 'Lion', emoji: '🦁', color: 'text-yellow-700 bg-yellow-200', darkColor: 'text-yellow-300 bg-yellow-800' },
//   { id: 'bear', name: 'Bear', emoji: '🐻', color: 'text-amber-700 bg-amber-200', darkColor: 'text-amber-300 bg-amber-800' },
//   { id: 'frog', name: 'Frog', emoji: '🐸', color: 'text-green-700 bg-green-200', darkColor: 'text-green-300 bg-green-800' },
//   { id: 'cat', name: 'Cat', emoji: '🐈', color: 'text-gray-700 bg-gray-200', darkColor: 'text-gray-300 bg-gray-700' },
//   { id: 'dog', name: 'Dog', emoji: '🐕', color: 'text-blue-700 bg-blue-200', darkColor: 'text-blue-300 bg-blue-800' },
//   { id: 'pig', name: 'Pig', emoji: '🐖', color: 'text-pink-700 bg-pink-200', darkColor: 'text-pink-300 bg-pink-800' },
//   { id: 'panda', name: 'Panda', emoji: '🐼', color: 'text-gray-900 bg-white', darkColor: 'text-gray-100 bg-gray-900' },
//   { id: 'monkey', name: 'Monkey', emoji: '🐒', color: 'text-brown-700 bg-yellow-300', darkColor: 'text-yellow-100 bg-yellow-900' },
//   { id: 'tiger', name: 'Tiger', emoji: '🐅', color: 'text-orange-700 bg-orange-200', darkColor: 'text-orange-300 bg-orange-800' },
//   { id: 'bunny', name: 'Bunny', emoji: '🐇', color: 'text-pink-600 bg-pink-100', darkColor: 'text-pink-200 bg-pink-900' },
//   { id: 'owl', name: 'Owl', emoji: '🦉', color: 'text-gray-800 bg-gray-300', darkColor: 'text-gray-100 bg-gray-800' },
//   { id: 'zebra', name: 'Zebra', emoji: '🦓', color: 'text-gray-900 bg-gray-100', darkColor: 'text-gray-50 bg-gray-900' },
//   { id: 'fox', name: 'Fox', emoji: '🦊', color: 'text-orange-600 bg-red-200', darkColor: 'text-orange-300 bg-red-900' },
//   { id: 'mouse', name: 'Mouse', emoji: '🐭', color: 'text-gray-500 bg-white', darkColor: 'text-gray-400 bg-gray-700' },
//   { id: 'hatchling', name: 'Chick', emoji: '🐣', color: 'text-yellow-600 bg-yellow-100', darkColor: 'text-yellow-400 bg-yellow-800' },
//   { id: 'whale', name: 'Whale', emoji: '🐋', color: 'text-blue-600 bg-blue-200', darkColor: 'text-blue-200 bg-blue-900' },
//   { id: 'snail', name: 'Snail', emoji: '🐌', color: 'text-green-800 bg-lime-200', darkColor: 'text-lime-300 bg-green-900' },
//   { id: 'camel', name: 'Camel', emoji: '🐪', color: 'text-yellow-800 bg-yellow-300', darkColor: 'text-yellow-400 bg-yellow-900' },
//   { id: 'elephant', name: 'Elephant', emoji: '🐘', color: 'text-gray-600 bg-gray-300', darkColor: 'text-gray-300 bg-gray-700' },
//   { id: 'penguin', name: 'Penguin', emoji: '🐧', color: 'text-cyan-600 bg-white', darkColor: 'text-cyan-200 bg-gray-800' },
//   { id: 'snake', name: 'Snake', emoji: '🐍', color: 'text-lime-700 bg-green-300', darkColor: 'text-lime-200 bg-green-900' },
//   { id: 'koala', name: 'Koala', emoji: '🐨', color: 'text-gray-800 bg-gray-100', darkColor: 'text-gray-200 bg-gray-900' },
//   { id: 'ladybug', name: 'Ladybug', emoji: '🐞', color: 'text-red-700 bg-red-200', darkColor: 'text-red-300 bg-red-800' },
//   { id: 'turtle', name: 'Turtle', emoji: '🐢', color: 'text-green-700 bg-emerald-200', darkColor: 'text-green-300 bg-emerald-800' },
// ];

// // Expanded to 20 options for the new layout (4 + 6 + 6 + 4)
// const OptionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']; 

// // --- Utility Functions ---
// const getRandomAnimals = (count: number, excludeId?: string): Animal[] => {
//   let available = ALL_ANIMALS.filter(a => a.id !== excludeId);
//   if (available.length < count) available = ALL_ANIMALS; 
  
//   const shuffled = available.sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// // --- Speech Utility ---
// const speak = (text: string, enabled: boolean) => {
//   if (!enabled || !('speechSynthesis' in window)) return;
  
//   // Clear any current speaking queue
//   if (window.speechSynthesis.speaking) {
//     window.speechSynthesis.cancel();
//   }

//   const utterance = new SpeechSynthesisUtterance(text);
//   utterance.rate = 0.9;
//   utterance.pitch = 1.1;
//   window.speechSynthesis.speak(utterance);
// };


// // --- Success Modal Component ---
// interface SuccessModalProps {
//   onNext: () => void;
//   targetAnimal: Animal;
//   isDarkMode: boolean;
// }

// const SuccessModal: React.FC<SuccessModalProps> = ({ onNext, targetAnimal, isDarkMode }) => {
//   const bgColor = isDarkMode 
//     ? targetAnimal.darkColor.replace('text-', 'text-').replace('bg-', 'bg-') 
//     : targetAnimal.color.replace('text-', 'text-').replace('bg-', 'bg-');

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
//       <div className={`relative p-8 rounded-3xl text-center shadow-2xl transform scale-100 animate-pop-in ${bgColor} border-4 border-white`}>
//         <div className="text-7xl mb-4 animate-bounce-slow">{targetAnimal.emoji}</div>
//         <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-800 drop-shadow-lg dark:text-gray-100">
//           Yes! You found the {targetAnimal.name}!
//         </h2>
//         <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">Great job matching!</p>
//         <button
//           onClick={onNext}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
//         >
//           <RefreshCw size={20} /> Next Animal!
//         </button>
//       </div>
//       <style>{`
//         @keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
//         .animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
//         @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
//         .animate-bounce-slow { animation: bounce-slow 3s infinite; }
//       `}</style>
//     </div>
//   );
// };

// // --- Main Game Component ---

// const AnimalMatchGame: React.FC = () => {
//   const [targetAnimal, setTargetAnimal] = useState<Animal>(ALL_ANIMALS[0]);
//   const [animalOptions, setAnimalOptions] = useState<Animal[]>([]);
//   const [draggedAnimal, setDraggedAnimal] = useState<Animal | null>(null);
//   const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'incorrect'>('playing');
//   const [isDraggingOver, setIsDraggingOver] = useState(false);
//   const [isDarkMode, setIsDark] = useState(false);
//   const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

//   // --- Theme Toggle ---
//   const toggleTheme = () => setIsDark(prev => !prev);
//   const toggleVoice = () => setIsVoiceEnabled(prev => !prev);

//   // Determine current color classes based on theme
//   const getCurrentColorClass = (animal: Animal) => isDarkMode ? animal.darkColor : animal.color;
//   const targetColorClass = getCurrentColorClass(targetAnimal);

//   // --- Game Logic ---
//   const initializeGame = useCallback(() => {
//     setGameStatus('playing');
//     setDraggedAnimal(null);
//     setIsDraggingOver(false);

//     // 1. Pick a new random target animal from the large static list (24)
//     const newTarget = ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];
//     setTargetAnimal(newTarget);

//     // 2. Prepare 19 random decoy options (from the list of 24)
//     const options = getRandomAnimals(19, newTarget.id); 
//     options.push(newTarget); // Add the correct answer
    
//     // Shuffle the final options and ensure exactly 20 options are used
//     const shuffledOptions = options.sort(() => 0.5 - Math.random()).slice(0, 20); 
//     setAnimalOptions(shuffledOptions);
    
//     // Voice prompt for new game
//     speak(`Find the ${newTarget.name}`, isVoiceEnabled);

//   }, [isVoiceEnabled]);

//   useEffect(() => {
//     // Initial game setup and welcome message
//     initializeGame();
//     speak('Welcome to the Animal Match Challenge! Drag the matching animal to the bottom box.', isVoiceEnabled);
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleNextAnimal = () => {
//     initializeGame();
//   };

//   // --- Drag Handlers ---
//   const handleDragStart = (animal: Animal) => {
//     setDraggedAnimal(animal);
//     setGameStatus('playing'); // Reset status if it was 'incorrect'
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault(); // Essential for enabling dropping
//     if (draggedAnimal) {
//       setIsDraggingOver(true);
//     }
//   };

//   const handleDragLeave = () => {
//     setIsDraggingOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDraggingOver(false);

//     if (!draggedAnimal) return;

//     if (draggedAnimal.id === targetAnimal.id) {
//       setGameStatus('success');
//       speak(`Fantastic! You found the ${targetAnimal.name}!`, isVoiceEnabled);
//     } else {
//       setGameStatus('incorrect');
//       speak(`Oops! That wasn't right. The animal is ${targetAnimal.name}. Try again!`, isVoiceEnabled);
//     }
//     setDraggedAnimal(null);
//   };

//   const handleTryAgain = () => {
//     setGameStatus('playing');
//   };

//   // --- Option Rendering Component ---
//   const OptionElement = ({ animal, label }: { animal: Animal, label: string }) => {
//     const colorClass = getCurrentColorClass(animal);
//     return (
//       <div
//         draggable
//         onDragStart={() => handleDragStart(animal)}
//         // p-2 on mobile, p-4 on desktop/TV
//         className={`p-2 sm:p-4 rounded-xl text-center shadow-lg cursor-grab transition-all duration-150 transform hover:scale-105 active:scale-95 
//           ${colorClass} font-bold text-lg sm:text-xl lg:text-2xl border-2 border-white select-none`}
//       >
//         <span className="mr-1 text-sm font-semibold text-gray-700 dark:text-gray-800 sm:text-base">{label}.</span>
//         {animal.emoji} {animal.name}
//       </div>
//     );
//   };
  
//   // --- Component Rendering ---

//   const TargetBox = (
//     <div className={`relative p-6 sm:p-8 rounded-2xl shadow-lg border-4 transition-all duration-300 w-full h-full min-h-[10rem] sm:min-h-[12rem] flex flex-col items-center justify-center 
//       ${targetColorClass.replace('text-', 'text-').replace('bg-200', isDarkMode ? 'bg-900' : 'bg-300')} 
//       ${gameStatus === 'playing' ? 'border-dashed border-gray-400 dark:border-gray-500 animate-pulse-slow' : 'border-solid border-white'}`}
//     >
//       <div className="absolute top-2 right-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Box 2</div>
//       <Sparkles className="text-yellow-500 absolute top-2 left-2" size={24} />
//       {/* Walking animation applied here */}
//       <div className="text-6xl sm:text-9xl md:text-[10rem] mb-2 animate-walk">{targetAnimal.emoji}</div>
//       <h3 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
//         Find the: <span className="underline">{targetAnimal.name}</span>
//       </h3>
//     </div>
//   );

//   const DropZone = (
//     <div
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//       className={`relative p-4 rounded-2xl shadow-xl border-4 transition-all duration-300 w-full h-full min-h-[10rem] sm:min-h-[12rem] flex flex-col items-center justify-center 
//         ${isDraggingOver 
//             ? targetColorClass.replace('text-', 'text-').replace('bg-200', isDarkMode ? 'bg-700' : 'bg-300')
//             : (gameStatus === 'incorrect' 
//                 ? 'bg-red-200 border-red-500 dark:bg-red-900 dark:border-red-600' 
//                 : 'bg-gray-100 border-dashed border-gray-300 dark:bg-gray-700 dark:border-gray-600'
//               )
//         }
//       `}
//     >
//       <div className="absolute top-2 right-4 text-xs font-semibold text-gray-700 dark:text-gray-400">Box 3</div>
//       {gameStatus === 'incorrect' ? (
//         <div className="text-center">
//           <XCircle className="text-red-500 mx-auto mb-3" size={48} />
//           <p className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">That wasn't right. Try again!</p>
//           <button
//             onClick={handleTryAgain}
//             className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : (
//         <p className={`text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-300 animate-pulse`}>
//           {isDraggingOver ? 'Drop Here!' : 'Drag the correct animal here!'}
//         </p>
//       )}
//     </div>
//   );

//   return (
//     <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans`}>
//       <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-900 p-4 sm:p-8">
//         <style>{`
//           @keyframes pulse-slow {
//             0%, 100% { transform: scale(1); }
//             50% { transform: scale(1.02); }
//           }
//           .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
          
//           @keyframes walk {
//             0% { transform: translateX(-5px); }
//             100% { transform: translateX(5px); }
//           }
//           .animate-walk {
//             animation: walk 2s infinite alternate ease-in-out;
//           }
//         `}</style>
//         <div className="max-w-6xl mx-auto"> 
          
//           {/* Header and Controls */}
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl sm:text-5xl font-extrabold text-purple-800 dark:text-purple-300 drop-shadow-md">
//               <Heart className="inline-block mb-2 mr-2 text-red-500" size={32} />
//               Animal Match Challenge
//             </h1>
//             <div className="flex gap-3">
//               <button
//                 onClick={toggleVoice}
//                 className={`p-3 rounded-full transition-colors shadow-lg ${
//                   isVoiceEnabled
//                     ? 'bg-green-500 hover:bg-green-600 text-white'
//                     : 'bg-gray-500 hover:bg-gray-600 text-white'
//                 }`}
//                 title="Toggle Voice"
//               >
//                 <Volume2 size={20} />
//               </button>
//               <button
//                 onClick={toggleTheme}
//                 className={`p-3 rounded-full transition-colors shadow-lg ${
//                   isDarkMode 
//                     ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' 
//                     : 'bg-gray-800 hover:bg-gray-900 text-white'
//                 }`}
//                 title="Toggle Theme"
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>
//             </div>
//           </div>


//           {/* --- Top Options (A - D) --- */}
//           {/* Responsive grid for 4 items: 2 cols on mobile, 4 on desktop */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//               {animalOptions.slice(0, 4).map((animal, index) => (
//                 <OptionElement key={animal.id} animal={animal} label={OptionLabels[index]} />
//               ))}
//           </div>

//           <div className="grid grid-cols-12 gap-4">
            
//             {/* Left Options (E-J) - 6 options:
//                - On mobile/tablet (col-span-12), this uses a 2/3 column grid and appears after Center Boxes due to order-2.
//                - On large screens (lg:col-span-3), it switches to a vertical flex column and moves to the left (order-1). */}
//             <div className="col-span-12 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col justify-between gap-4 order-2 lg:order-1">
//               {animalOptions.slice(4, 10).map((animal, index) => (
//                 <OptionElement key={animal.id} animal={animal} label={OptionLabels[index + 4]} />
//               ))}
//             </div>

//             {/* Center Boxes (Box 2 and Box 3): Prioritized on mobile (order-1) to appear first */}
//             <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
//               <div className="h-1/2">{TargetBox}</div>
//               <div className="h-1/2">{DropZone}</div>
//             </div>

//             {/* Right Options (K-P) - 6 options:
//                - On mobile/tablet (col-span-12), this uses a 2/3 column grid and appears last (order-3).
//                - On large screens (lg:col-span-3), it switches to a vertical flex column and moves to the right (order-3). */}
//             <div className="col-span-12 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col justify-between gap-4 order-3 lg:order-3">
//               {animalOptions.slice(10, 16).map((animal, index) => (
//                 <OptionElement key={animal.id} animal={animal} label={OptionLabels[index + 10]} />
//               ))}
//             </div>

//           </div>
          
//           {/* --- Bottom Options (Q - T) --- */}
//           {/* Responsive grid for 4 items: 2 cols on mobile, 4 on desktop */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//               {animalOptions.slice(16, 20).map((animal, index) => (
//                 <OptionElement key={animal.id} animal={animal} label={OptionLabels[index + 16]} />
//               ))}
//           </div>

//         </div>
        
//         {/* Success Modal */}
//         {gameStatus === 'success' && (
//           <SuccessModal 
//             onNext={handleNextAnimal}
//             targetAnimal={targetAnimal}
//             isDarkMode={isDarkMode}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnimalMatchGame;

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Heart, Sparkles, Sun, Moon, Volume2 } from 'lucide-react';
import { useGameModule } from '@/hooks/useGameModule';

// --- Data Definitions ---
interface Animal {
  id: string;
  name: string;
  emoji: string;
  color: string; // Tailwind color class for styling
  darkColor: string; // Tailwind dark color class for styling
}

// Static list of 24 unique animals for high variety
const ALL_ANIMALS: Animal[] = [
  { id: 'lion', name: 'Lion', emoji: '🦁', color: 'text-yellow-700 bg-yellow-200', darkColor: 'text-yellow-300 bg-yellow-800' },
  { id: 'bear', name: 'Bear', emoji: '🐻', color: 'text-amber-700 bg-amber-200', darkColor: 'text-amber-300 bg-amber-800' },
  { id: 'frog', name: 'Frog', emoji: '🐸', color: 'text-green-700 bg-green-200', darkColor: 'text-green-300 bg-green-800' },
  { id: 'cat', name: 'Cat', emoji: '🐈', color: 'text-gray-700 bg-gray-200', darkColor: 'text-gray-300 bg-gray-700' },
  { id: 'dog', name: 'Dog', emoji: '🐕', color: 'text-blue-700 bg-blue-200', darkColor: 'text-blue-300 bg-blue-800' },
  { id: 'pig', name: 'Pig', emoji: '🐖', color: 'text-pink-700 bg-pink-200', darkColor: 'text-pink-300 bg-pink-800' },
  { id: 'panda', name: 'Panda', emoji: '🐼', color: 'text-gray-900 bg-white', darkColor: 'text-gray-100 bg-gray-900' },
  { id: 'monkey', name: 'Monkey', emoji: '🐒', color: 'text-brown-700 bg-yellow-300', darkColor: 'text-yellow-100 bg-yellow-900' },
  { id: 'tiger', name: 'Tiger', emoji: '🐅', color: 'text-orange-700 bg-orange-200', darkColor: 'text-orange-300 bg-orange-800' },
  { id: 'bunny', name: 'Bunny', emoji: '🐇', color: 'text-pink-600 bg-pink-100', darkColor: 'text-pink-200 bg-pink-900' },
  { id: 'owl', name: 'Owl', emoji: '🦉', color: 'text-gray-800 bg-gray-300', darkColor: 'text-gray-100 bg-gray-800' },
  { id: 'zebra', name: 'Zebra', emoji: '🦓', color: 'text-gray-900 bg-gray-100', darkColor: 'text-gray-50 bg-gray-900' },
  { id: 'fox', name: 'Fox', emoji: '🦊', color: 'text-orange-600 bg-red-200', darkColor: 'text-orange-300 bg-red-900' },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', color: 'text-gray-500 bg-white', darkColor: 'text-gray-400 bg-gray-700' },
  { id: 'hatchling', name: 'Chick', emoji: '🐣', color: 'text-yellow-600 bg-yellow-100', darkColor: 'text-yellow-400 bg-yellow-800' },
  { id: 'whale', name: 'Whale', emoji: '🐋', color: 'text-blue-600 bg-blue-200', darkColor: 'text-blue-200 bg-blue-900' },
  { id: 'snail', name: 'Snail', emoji: '🐌', color: 'text-green-800 bg-lime-200', darkColor: 'text-lime-300 bg-green-900' },
  { id: 'camel', name: 'Camel', emoji: '🐪', color: 'text-yellow-800 bg-yellow-300', darkColor: 'text-yellow-400 bg-yellow-900' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', color: 'text-gray-600 bg-gray-300', darkColor: 'text-gray-300 bg-gray-700' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', color: 'text-cyan-600 bg-white', darkColor: 'text-cyan-200 bg-gray-800' },
  { id: 'snake', name: 'Snake', emoji: '🐍', color: 'text-lime-700 bg-green-300', darkColor: 'text-lime-200 bg-green-900' },
  { id: 'koala', name: 'Koala', emoji: '🐨', color: 'text-gray-800 bg-gray-100', darkColor: 'text-gray-200 bg-gray-900' },
  { id: 'ladybug', name: 'Ladybug', emoji: '🐞', color: 'text-red-700 bg-red-200', darkColor: 'text-red-300 bg-red-800' },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', color: 'text-green-700 bg-emerald-200', darkColor: 'text-green-300 bg-emerald-800' },
];

// Expanded to 20 options for the new layout (4 + 6 + 6 + 4)
const OptionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']; 

// --- Utility Functions ---
const getRandomAnimals = (count: number, excludeId?: string): Animal[] => {
  let available = ALL_ANIMALS.filter(a => a.id !== excludeId);
  if (available.length < count) available = ALL_ANIMALS; 
  
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// --- Speech Utility ---
const speak = (text: string, enabled: boolean) => {
  if (!enabled || !('speechSynthesis' in window)) return;
  
  // Clear any current speaking queue
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
};


// --- Success Modal Component ---
interface SuccessModalProps {
  onNext: () => void;
  targetAnimal: Animal;
  isDarkMode: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onNext, targetAnimal, isDarkMode }) => {
  const bgColor = isDarkMode 
    ? targetAnimal.darkColor.replace('text-', 'text-').replace('bg-', 'bg-') 
    : targetAnimal.color.replace('text-', 'text-').replace('bg-', 'bg-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`relative p-8 rounded-3xl text-center shadow-2xl transform scale-100 animate-pop-in ${bgColor} border-4 border-white`}>
        <div className="text-7xl mb-4 animate-bounce-slow">{targetAnimal.emoji}</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-800 drop-shadow-lg dark:text-gray-100">
          Yes! You found the {targetAnimal.name}!
        </h2>
        <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">Great job matching!</p>
        <button
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={20} /> Next Animal!
        </button>
      </div>
      <style>{`
        @keyframes pop-in { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
};

// --- Main Game Component ---

const AnimalMatchGame: React.FC = () => {
  const { isDarkModeMode } = useGameModule();
  const [targetAnimal, setTargetAnimal] = useState<Animal>(ALL_ANIMALS[0]);
  const [animalOptions, setAnimalOptions] = useState<Animal[]>([]);
  const [draggedAnimal, setDraggedAnimal] = useState<Animal | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'incorrect'>('playing');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // --- Voice Toggle (theme now controlled globally in header) ---
  const toggleVoice = () => setIsVoiceEnabled(prev => !prev);

  // Determine current color classes based on theme
  const getCurrentColorClass = (animal: Animal) => isDarkMode ? animal.darkColor : animal.color;
  const targetColorClass = getCurrentColorClass(targetAnimal);

  // --- Game Logic ---
  const initializeGame = useCallback(() => {
    setGameStatus('playing');
    setDraggedAnimal(null);
    setIsDraggingOver(false);

    // 1. Pick a new random target animal from the large static list (24)
    const newTarget = ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];
    setTargetAnimal(newTarget);

    // 2. Prepare 19 random decoy options (from the list of 24)
    const options = getRandomAnimals(19, newTarget.id); 
    options.push(newTarget); // Add the correct answer
    
    // Shuffle the final options and ensure exactly 20 options are used
    const shuffledOptions = options.sort(() => 0.5 - Math.random()).slice(0, 20); 
    setAnimalOptions(shuffledOptions);
    
    // Voice prompt for new game
    speak(`Find the ${newTarget.name}`, isVoiceEnabled);

  }, [isVoiceEnabled]);

  useEffect(() => {
    // Initial game setup and welcome message
    initializeGame();
    speak('Welcome to the Animal Match Challenge! Drag the matching animal to the bottom box.', isVoiceEnabled);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNextAnimal = () => {
    initializeGame();
  };

  // --- Drag Handlers ---
  const handleDragStart = (animal: Animal) => {
    setDraggedAnimal(animal);
    setGameStatus('playing'); // Reset status if it was 'incorrect'
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Essential for enabling dropping
    if (draggedAnimal) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (!draggedAnimal) return;

    if (draggedAnimal.id === targetAnimal.id) {
      setGameStatus('success');
      speak(`Fantastic! You found the ${targetAnimal.name}!`, isVoiceEnabled);
    } else {
      setGameStatus('incorrect');
      speak(`Oops! That wasn't right. The animal is ${targetAnimal.name}. Try again!`, isVoiceEnabled);
    }
    setDraggedAnimal(null);
  };

  const handleTryAgain = () => {
    setGameStatus('playing');
  };

  // --- Option Rendering Component ---
  const OptionElement = ({ animal, label, className = '' }: { animal: Animal, label: string, className?: string }) => {
    const colorClass = getCurrentColorClass(animal);
    return (
      <div
        draggable
        onDragStart={() => handleDragStart(animal)}
        // Added shadow-2xl for sticker effect
        className={`p-1 md:p-3 rounded-xl text-center shadow-2xl cursor-grab transition-all duration-150 transform hover:scale-105 active:scale-95 
          ${colorClass} font-bold text-base md:text-xl lg:text-2xl border-2 border-white select-none ${className}`}
      >
        <span className="mr-1 text-xs font-semibold text-gray-700 dark:text-gray-800 md:text-sm">{label}.</span>
        {/* Added drop-shadow-lg for visual pop */}
        <span className="drop-shadow-lg">{animal.emoji}</span> {animal.name}
      </div>
    );
  };
  
  // --- Component Rendering ---

  const TargetBox = (
    <div className={`relative p-6 sm:p-8 rounded-2xl shadow-lg border-4 transition-all duration-300 w-full h-full min-h-[10rem] sm:min-h-[12rem] flex flex-col items-center justify-center 
      ${targetColorClass.replace('text-', 'text-').replace('bg-200', isDarkMode ? 'bg-900' : 'bg-300')} 
      ${gameStatus === 'playing' ? 'border-dashed border-gray-400 dark:border-gray-500 animate-pulse-slow border-white' : 'border-solid border-white'}`}
    >
      <div className="absolute top-2 right-4 text-xs font-semibold text-gray-700 dark:text-gray-300">Box 2</div>
      <Sparkles className="text-yellow-500 absolute top-2 left-2" size={24} />
      {/* Walking animation applied here, added drop-shadow-2xl for max visual appeal */}
      <div className="text-6xl sm:text-9xl md:text-[10rem] mb-2 animate-walk drop-shadow-2xl">{targetAnimal.emoji}</div>
      <h3 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
        Find the: <span className="underline">{targetAnimal.name}</span>
      </h3>
    </div>
  );

  const DropZone = (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative p-4 rounded-2xl shadow-xl border-4 transition-all duration-300 w-full h-full min-h-[10rem] sm:min-h-[12rem] flex flex-col items-center justify-center 
        ${isDraggingOver 
            ? targetColorClass.replace('text-', 'text-').replace('bg-200', isDarkMode ? 'bg-700' : 'bg-300')
            : (gameStatus === 'incorrect' 
                ? 'bg-red-200 border-red-500 dark:bg-red-900 dark:border-red-600' 
                : 'bg-gray-100 border-dashed border-gray-300 dark:bg-gray-700 dark:border-gray-600'
              )
        }
      `}
    >
      <div className="absolute top-2 right-4 text-xs font-semibold text-gray-700 dark:text-gray-400">Box 3</div>
      {gameStatus === 'incorrect' ? (
        <div className="text-center">
          <XCircle className="text-red-500 mx-auto mb-3" size={48} />
          <p className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">That wasn't right. Try again!</p>
          <button
            onClick={handleTryAgain}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <p className={`text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-300 animate-pulse`}>
          {isDraggingOver ? 'Drop Here!' : 'Drag the correct animal here!'}
        </p>
      )}
    </div>
  );

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans`}>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-900 p-2 md:p-8">
        <style>{`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
          
          @keyframes walk {
            0% { transform: translateX(-5px); }
            100% { transform: translateX(5px); }
          }
          .animate-walk {
            animation: walk 2s infinite alternate ease-in-out;
          }
        `}</style>
        <div className="max-w-6xl mx-auto"> 
          
          {/* Header and Controls */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-purple-800 dark:text-purple-300 drop-shadow-md">
              <Heart className="inline-block mb-1 mr-1 text-red-500" size={24} />
              Animal Match Challenge
            </h1>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={toggleVoice}
                className={`p-2 sm:p-3 rounded-full transition-colors shadow-lg ${
                  isVoiceEnabled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
                title="Toggle Voice"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>


          {/* --- Top Options (A - D): Show 2 on mobile, 4 on SM+ --- */}
          {/* Grid starts at 2 columns on mobile and expands to 4 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {animalOptions.slice(0, 4).map((animal, index) => (
                <OptionElement 
                  key={animal.id} 
                  animal={animal} 
                  label={OptionLabels[index]} 
                  // Hide options C (index 2) and D (index 3) on small screens
                  className={index >= 2 ? 'hidden sm:block' : ''} 
                />
              ))}
          </div>

          <div className="grid grid-cols-12 gap-4">
            
            {/* Left Options (E-J): Show 3 on mobile, 6 on LG+ */}
            {/* Grid starts at 2 columns on mobile, 3 columns on md, and flex column on lg+ */}
            <div className="col-span-12 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col justify-between gap-2 order-2 lg:order-1">
              {animalOptions.slice(4, 10).map((animal, index) => (
                <OptionElement 
                  key={animal.id} 
                  animal={animal} 
                  label={OptionLabels[index + 4]} 
                  // Hide options H, I, J (index 3, 4, 5) on small screens
                  className={index >= 3 ? 'hidden sm:block' : ''} 
                />
              ))}
            </div>

            {/* Center Boxes (Box 2 and Box 3): Prioritized on mobile (order-1) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
              <div className="h-1/2">{TargetBox}</div>
              <div className="h-1/2">{DropZone}</div>
            </div>

            {/* Right Options (K-P): Show 3 on mobile, 6 on LG+ */}
            {/* Grid starts at 2 columns on mobile, 3 columns on md, and flex column on lg+ */}
            <div className="col-span-12 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col justify-between gap-2 order-3 lg:order-3">
              {animalOptions.slice(10, 16).map((animal, index) => (
                <OptionElement 
                  key={animal.id} 
                  animal={animal} 
                  label={OptionLabels[index + 10]} 
                  // Hide options N, O, P (index 3, 4, 5) on small screens
                  className={index >= 3 ? 'hidden sm:block' : ''} 
                />
              ))}
            </div>

          </div>
          
          {/* --- Bottom Options (Q - T): Show 2 on mobile, 4 on SM+ --- */}
          {/* Grid starts at 2 columns on mobile and expands to 4 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {animalOptions.slice(16, 20).map((animal, index) => (
                <OptionElement 
                  key={animal.id} 
                  animal={animal} 
                  label={OptionLabels[index + 16]} 
                  // Hide options S (index 2) and T (index 3) on small screens
                  className={index >= 2 ? 'hidden sm:block' : ''} 
                />
              ))}
          </div>

        </div>
        
        {/* Success Modal */}
        {gameStatus === 'success' && (
          <SuccessModal 
            onNext={handleNextAnimal}
            targetAnimal={targetAnimal}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default AnimalMatchGame;