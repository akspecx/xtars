import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react'; // Added Moon and Sun for theme toggle

// Define the shape of the color data for a train car
interface TrainCarColors {
  main: string;
  roof: string;
  border: string;
}

// Main App component
const App: React.FC = () => {
  const [gameNumbers, setGameNumbers] = useState<number[]>([]);
  const [droppedNumbers, setDroppedNumbers] = useState<(number | null)[]>(new Array(5).fill(null));
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);
  const [draggedSourceIndex, setDraggedSourceIndex] = useState<number | null>(null);
  const [draggedFromDroppedZone, setDraggedFromDroppedZone] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [trainMoving, setTrainMoving] = useState<boolean>(false);
  const [currentDroppedTarget, setCurrentDroppedTarget] = useState<number | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false); // Theme state
  const [gameId, setGameId] = useState<number>(0); // Added for reliable component reset

  const dropZoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Color schemes for different train cars
  const trainCarColors: Record<number, TrainCarColors> = {
    1: { main: 'from-pink-400 to-pink-500', border: 'border-pink-600', roof: 'bg-pink-300' },
    2: { main: 'from-purple-400 to-purple-500', border: 'border-purple-600', roof: 'bg-purple-300' },
    3: { main: 'from-yellow-400 to-yellow-500', border: 'border-yellow-600', roof: 'bg-yellow-300' },
    4: { main: 'from-green-400 to-green-500', border: 'border-green-600', roof: 'bg-green-300' },
    5: { main: 'from-orange-400 to-orange-500', border: 'border-orange-600', roof: 'bg-orange-300' }
  };

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  // Voice synthesis function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isSpeaking) {
      // Cancel existing speech before starting a new one to prevent overlap
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  /**
   * Checks if sequence is correct (DESCENDING: 5, 4, 3, 2, 1)
   */
  const checkSequence = useCallback((newDroppedNumbers: (number | null)[]) => {
    const isComplete = newDroppedNumbers.every(num => num !== null);
    if (isComplete) {
      // Check for descending order: index 0 must be 5, index 1 must be 4, etc. (5 - index)
      const isCorrect = newDroppedNumbers.every((num, index) => num === 5 - index);
      
      if (isCorrect) {
        setTrainMoving(true);
        speak("Awesome! You arranged the train perfectly! Get ready for a surprise!");
        setTimeout(() => {
          setShowSuccess(true);
          if ('speechSynthesis' in window) speechSynthesis.cancel();
          speak("Here are some yummy candies for you!");
        }, 3000); // Duration of the train animation
      } else {
        setShowError(true);
        // Updated error speech for full drag and drop
        speak("Oops! That's not quite right. Remember, the largest number comes first: 5, then 4, then 3, then 2, and finally 1. You can drag the cars already on the track to rearrange them. Try again!");
      }
    }
  }, [speak]);

  /**
   * Initializes the game for full drag-and-drop descending order (5, 4, 3, 2, 1).
   * All 5 cars start in the available pool, and the track is completely empty.
   */
  const initializeGame = useCallback(() => {
    
    // 1. All slots on the track are empty
    const newDroppedNumbers: (number | null)[] = new Array(5).fill(null);
    
    // 2. All numbers (1-5) are available at the bottom, shuffled (Random order fix implemented here)
    const initialNumbers = [1, 2, 3, 4, 5];
    const shuffledAvailableNumbers = [...initialNumbers].sort(() => Math.random() - 0.5);

    setGameNumbers(shuffledAvailableNumbers);
    setDroppedNumbers(newDroppedNumbers);
    setDraggedNumber(null);
    setDraggedSourceIndex(null);
    setDraggedFromDroppedZone(false);
    setShowSuccess(false);
    setShowError(false);
    setGameStarted(true);
    setTrainMoving(false);
    setGameId(prev => prev + 1); 

    if ('speechSynthesis' in window) speechSynthesis.cancel();
    // Updated instructional speech
    speak(`Time to build the train! The train needs to be in descending order: 5, 4, 3, 2, and finally 1. Drag the cars below to complete the train!`);
  }, [speak]); // Added speak dependency

  // Drag and Drop Handlers (for both mouse and touch)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, number: number, isDropped: boolean, index: number | null) => {
    setDraggedNumber(number);
    setDraggedFromDroppedZone(isDropped);
    setDraggedSourceIndex(index);
    if ('dataTransfer' in e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', number.toString());
    }
    speak(`You picked train car number ${number}. Now drop it in the right position!`);
  };

  // New function to handle the end of a drag or touch event
  const handleDragEnd = () => {
    setDraggedNumber(null);
    setDraggedFromDroppedZone(false);
    setDraggedSourceIndex(null);
    setCurrentDroppedTarget(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if ('dataTransfer' in e) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setCurrentDroppedTarget(targetIndex);
  };

  const handleDragLeave = () => {
    setCurrentDroppedTarget(null);
  };

  /**
   * Updated handleDrop for full drag and drop logic.
   * Allows dragging from the available pool (bottom) to an empty track slot.
   * Also allows dragging from an occupied track slot to another (swapping/reordering).
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setCurrentDroppedTarget(null);
    
    if (draggedNumber === null) return; 

    const newDroppedNumbers = [...droppedNumbers];
    let newGameNumbers = [...gameNumbers]; // Use let for mutation
    const targetNumber = newDroppedNumbers[targetIndex];

    if (draggedFromDroppedZone) {
      // SCENARIO 1: Dragging from one track slot (sourceIndex) to another track slot (targetIndex)
      if (draggedSourceIndex !== null && draggedSourceIndex !== targetIndex) {
        
        if (targetNumber === null) {
          // Move from source to empty target
          newDroppedNumbers[targetIndex] = draggedNumber;
          newDroppedNumbers[draggedSourceIndex] = null;
          speak(`You moved train car ${draggedNumber}.`);
        } else {
          // Swap: move from source to occupied target, and move target number to source
          newDroppedNumbers[targetIndex] = draggedNumber;
          newDroppedNumbers[draggedSourceIndex] = targetNumber;
          speak(`You swapped train car ${draggedNumber} with train car ${targetNumber}.`);
        }
      }
      
    } else {
      // SCENARIO 2: Dragging from the available pool (bottom) to a track slot (targetIndex)
      
      if (targetNumber !== null) {
        // Drop zone is occupied, reject the drop or move the occupied car to the available pool
        speak(`That spot is already taken by car ${targetNumber}. You need to empty it first or drag your car to an empty spot.`);
        handleDragEnd();
        return; 
      }

      // Dropping a car from the bottom row to an empty drop zone slot
      newDroppedNumbers[targetIndex] = draggedNumber;

      // Remove the number from the available list
      const gameNumberIndex = newGameNumbers.findIndex(n => n === draggedNumber);
      if (gameNumberIndex > -1) {
        newGameNumbers.splice(gameNumberIndex, 1);
      }
      
      speak(`You placed train car number ${draggedNumber} in position ${targetIndex + 1}.`);
    }

    setDroppedNumbers(newDroppedNumbers);
    setGameNumbers(newGameNumbers);
    handleDragEnd(); // Reset drag state
    checkSequence(newDroppedNumbers);
  };

  // Train car component
  const TrainCar: React.FC<{
    number: number | null;
    colors: TrainCarColors;
    isDropZone?: boolean;
    isEmpty?: boolean;
    isAvailable?: boolean;
    isDragged?: boolean;
    isDropTarget?: boolean;
    index?: number; // Added index for drag start from track
  }> = ({ number, colors, isDropZone = false, isEmpty = false, isAvailable = false, isDragged = false, isDropTarget = false, index }) => {
    
    // Determine if the car can be dragged
    const canBeDragged = isAvailable || (isDropZone && number !== null);

    return (
      <div
        className={`relative transition-all duration-300 ${isDragged ? 'scale-110 z-10 opacity-70' : ''} ${
          canBeDragged ? 'cursor-grab active:cursor-grabbing' : ''
        } ${isDropTarget ? 'scale-105' : ''}`}
        draggable={canBeDragged}
        onDragStart={(e) => {
          if (canBeDragged && number !== null) {
            handleDragStart(e, number, isDropZone, index !== undefined ? index : null);
          }
        }}
        onTouchStart={(e) => {
          if (canBeDragged && number !== null) {
            handleDragStart(e, number, isDropZone, index !== undefined ? index : null);
          }
        }}
        onDragEnd={handleDragEnd}
        onTouchEnd={handleDragEnd}
      >
        {/* Main car body */}
        <div className={`
          ${isEmpty ? (isDark ? 'border-4 border-dashed border-gray-600 bg-gray-700' : 'border-4 border-dashed border-gray-400 bg-gray-100') :
            `bg-gradient-to-b ${colors.main} border-4 ${colors.border}`}
          rounded-lg w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-18 flex items-center justify-center shadow-lg
          transform transition-all duration-200
          ${canBeDragged ? 'hover:scale-105 hover:shadow-xl' : ''}
        `}>
          {isEmpty || number === null ? (
            <div className={`text-xs text-center leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Drop<br />Here</div>
          ) : (
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{number}</div>
          )}
        </div>

        {/* Wheels */}
        <div className={`absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 ${
          isEmpty ? (isDark ? 'bg-gray-500 border-gray-600' : 'bg-gray-300 border-gray-400') : 'bg-gray-800 border-gray-900'
        } rounded-full border-2`}></div>
        <div className={`absolute -bottom-1 sm:-bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 ${
          isEmpty ? (isDark ? 'bg-gray-500 border-gray-600' : 'bg-gray-300 border-gray-400') : 'bg-gray-800 border-gray-900'
        } rounded-full border-2`}></div>

        {/* Car roof */}
        <div className={`absolute -top-1 sm:-top-2 left-0.5 sm:left-1 right-0.5 sm:right-1 h-2 sm:h-3 ${
          isEmpty ? (isDark ? 'bg-gray-600 border-gray-700 border-dashed' : 'bg-gray-200 border-gray-400 border-dashed') :
            `${colors.roof} border-2 ${colors.border}`
        } rounded-t-lg `}></div>

        {/* Cute decorations */}
        {!isEmpty && (
          <>
            <div className="absolute top-1 left-1 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-1 right-1 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full opacity-80"></div>
          </>
        )}
        
        {/* Train Car Joiner */}
        {!isEmpty && (
          <div className="absolute -left-1 sm:-left-2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-2 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
        )}
      </div>
    );
  };

  // Engine component
  const Engine: React.FC = () => (
    <div className="relative mr-2 sm:mr-3">
      {/* Engine body */}
      <div className="bg-gradient-to-b from-red-400 to-red-500 border-4 border-red-600 rounded-lg w-18 h-14 sm:w-24 sm:h-20 md:w-28 md:h-22 flex flex-col items-center justify-center shadow-lg">
        <div className="text-lg sm:text-2xl mb-0 sm:mb-1">🚂</div>
        <div className="text-white font-bold text-xs sm:text-sm">Engine</div>
      </div>

      {/* Engine wheels */}
      <div className="absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full border-2 border-gray-900"></div>
      <div className="absolute -bottom-1 sm:-bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full border-2 border-gray-900"></div>

      {/* Engine roof/smokestack area */}
      <div className="absolute -top-2 sm:-top-3 left-1 sm:left-2 right-1 sm:right-2 h-3 sm:h-4 bg-red-300 rounded-t-lg border-2 border-red-600"></div>

      {/* Smokestack */}
      <div className="absolute -top-3 sm:-top-5 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-gray-700 rounded-full"></div>

      {/* Smoke effect */}
      <div className="absolute -top-5 sm:-top-7 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm">💨</div>
      
      {/* Engine to Coach Joiner */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-2 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
    </div>
  );

  if (!gameStarted) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-sky-200 to-green-200'
      }`}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          
          {/* Theme Toggle in Start Screen */}
          <button
            onClick={toggleTheme}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
              isDark ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className={`text-center max-w-md mx-auto p-8 rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-purple-300' : 'text-blue-800'
            }`}>
              🚂 Train Number Game 🚂
            </h1>
            <p className={`text-lg sm:text-xl mb-4 sm:mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Help arrange the colorful train cars in **descending order**!
            </p>
            <p className={`text-base sm:text-lg mb-6 sm:mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Drag the train cars onto the track in sequence: **5, 4, 3, 2, 1**
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={initializeGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                Start Game! 🎮
              </button>

              <button
                onClick={() => speak("Welcome to the Train Number Game! You will drag colorful train cars to arrange them in **descending order** from 5 to 1. Each car has a different color and you need to put them in the right sequence. Have fun!")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
                disabled={isSpeaking}
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Hear Instructions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 p-2 sm:p-4 ${
      isDark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-sky-200 to-green-200 text-gray-800'
    }`}>
      <style>
        {`
        /* UPDATED: Train animation moves off-screen to the left (negative X) */
        @keyframes move-forward {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-150vw); /* Moves train completely off-screen to the left */
          }
        }
        .animate-move-forward {
          animation: move-forward 3s ease-in-out forwards;
        }

        /* NEW: Kid Cheering Animation */
        @keyframes cheering-jump {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            25% { transform: translateY(-20px) rotate(10deg) scale(1.1); }
            50% { transform: translateY(0) rotate(-10deg) scale(1); }
            75% { transform: translateY(-10px) rotate(5deg) scale(1.05); }
        }
        .animate-cheering {
            animation: cheering-jump 0.8s ease-in-out infinite;
        }
        `}
      </style>

      {/* Success Popup (Removed animate-bounce from modal container) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="text-4xl sm:text-6xl mb-4">🎉</div>
            
            {/* NEW: Kid Cheering Animation Element */}
            <div className="text-6xl sm:text-8xl mb-4 animate-cheering drop-shadow-lg">
              🥳
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Awesome!</h2>
            <div className="text-2xl sm:text-4xl mb-4">🍭🍬🍪🧁🍰</div>
            <p className={`text-lg sm:text-xl mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Great job arranging the train!</p>
            <button
              onClick={initializeGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all"
            >
              Play Again! 🔄
            </button>
          </div>
        </div>
      )}

      {/* Error Popup (Theme applied to background and text) */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowError(false)}>
          <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl max-w-sm mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl sm:text-6xl mb-4">🤔</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-4">Oops!</h2>
            <p className={`text-lg sm:text-xl mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Not quite right! Remember:</p>
            <p className="text-base sm:text-lg text-blue-500 font-semibold mb-4">
              First comes **5**, then **4**, then **3**, then **2**, and finally **1**!
            </p>
            <button
              onClick={() => {
                setShowError(false);
                // Speak instructions on how to try again
                speak("Try again! You can drag the cars already on the track to rearrange them.");
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all"
            >
              Close and Try Again 💪
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-8 mt-4">
          <h1 className={`text-xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-purple-300' : 'text-blue-800'} text-center w-full`}>
            🚂 Arrange the Train Cars (Descending)! 🚂
          </h1>
          
          {/* Theme Toggle in Game Screen */}
          <button
            onClick={toggleTheme}
            className={`p-2 sm:p-3 rounded-full shadow-lg transition-colors absolute top-4 right-4 ${
              isDark ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Engine and Train Cars */}
        {/* Responsive Track: Uses overflow-x-auto to ensure horizontal scrolling if the train exceeds screen width */}
        <div className="mb-6 sm:mb-8 border-b-4 border-gray-600">
          <div className="flex items-center justify-center mb-4 sm:mb-6 pb-4 overflow-x-auto">
            {/* Added key={gameId} to force remount and reset CSS animation state on new game */}
            <div 
              key={gameId} 
              className={`flex items-center gap-1 sm:gap-2 min-w-max px-4 ${trainMoving ? 'animate-move-forward' : ''}`}
            >
              <Engine />
              {/* Train Cars - Drop Zones */}
              {droppedNumbers.map((number, index) => (
                <div
                  key={index}
                  className={`mx-0.5 sm:mx-1 transition-all duration-200 ${currentDroppedTarget === index ? 'scale-105' : ''}`}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  // Added touch support to drop zone
                  onTouchMove={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>)}
                  onTouchEnd={(e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>, index)}
                >
                  <TrainCar
                    number={number}
                    colors={number !== null ? trainCarColors[number] : {} as TrainCarColors}
                    isDropZone={true}
                    isEmpty={number === null}
                    index={index} // Pass index so dragging from track works
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Numbers as Train Cars */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className={`text-lg sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Drag all 5 cars onto the track:
          </h2>

          {/* Responsive list of available cars with flex-wrap */}
          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap px-4">
            {/* FIX: Removed .sort() here so the shuffled order from initializeGame is maintained */}
            {gameNumbers.map((number) => ( 
              <TrainCar
                key={number}
                number={number}
                colors={trainCarColors[number]}
                isAvailable={true}
                isDragged={!draggedFromDroppedZone && draggedNumber === number}
              />
            ))}
          </div>

          {gameNumbers.length === 0 && droppedNumbers.some(n => n === null) && (
             <p className={`text-base sm:text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
               All cars are on the track. Now check your order!
             </p>
          )}

          {gameNumbers.length === 0 && droppedNumbers.every(n => n !== null) && !showSuccess && !showError && (
            <p className={`text-base sm:text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              All cars placed! Checking your answer... 🤔
            </p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
          <button
            onClick={initializeGame}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
          >
            New Game 🎲
          </button>

          <button
            onClick={() => {
                if (isSpeaking) {
                    if ('speechSynthesis' in window) speechSynthesis.cancel();
                    setIsSpeaking(false);
                } else {
                    // Updated guidance for descending order (5, 4, 3, 2, 1)
                    speak("Remember, arrange the train cars in descending order: Orange car with number 5 first, then green car with 4, yellow car with 3, purple car with 2, and finally pink car with 1!");
                }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
            disabled={!('speechSynthesis' in window)}
          >
            {isSpeaking ? '🔊 Stop Speaking' : '🔊 Help'}
          </button>
        </div>

        {/* Instructions (Theme applied to background and text) */}
        <div className={`text-center rounded-lg p-4 mx-4 sm:mx-0 shadow-inner ${
          isDark ? 'bg-gray-700 bg-opacity-70 text-gray-200' : 'bg-white bg-opacity-70 text-gray-700'
        }`}>
          <p className="text-sm sm:text-lg">
            <span className="font-bold">How to play:</span> Drag the colorful train cars from the bottom to the empty spaces on the track in **descending order**:
            <span className="inline-block mx-1">🧡5</span>
            <span className="inline-block mx-1">💚4</span>
            <span className="inline-block mx-1">💛3</span>
            <span className="inline-block mx-1">💜2</span>
            <span className="inline-block mx-1">🩷1</span> 🎯
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;