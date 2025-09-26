import React, { useState, useRef, useEffect } from 'react';

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

  const dropZoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Color schemes for different train cars
  const trainCarColors: Record<number, TrainCarColors> = {
    1: { main: 'from-pink-400 to-pink-500', border: 'border-pink-600', roof: 'bg-pink-300' },
    2: { main: 'from-purple-400 to-purple-500', border: 'border-purple-600', roof: 'bg-purple-300' },
    3: { main: 'from-yellow-400 to-yellow-500', border: 'border-yellow-600', roof: 'bg-yellow-300' },
    4: { main: 'from-green-400 to-green-500', border: 'border-green-600', roof: 'bg-green-300' },
    5: { main: 'from-orange-400 to-orange-500', border: 'border-orange-600', roof: 'bg-orange-300' }
  };

  // Voice synthesis function
  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Initialize game with shuffled numbers
  const initializeGame = () => {
    const numbers = [1, 2, 3, 4, 5];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setGameNumbers(shuffled);
    setDroppedNumbers(new Array(5).fill(null));
    setDraggedNumber(null);
    setDraggedSourceIndex(null);
    setDraggedFromDroppedZone(false);
    setShowSuccess(false);
    setShowError(false);
    setGameStarted(true);
    setTrainMoving(false);
    speak("Welcome to the Train Number Game! Drag the colorful train cars to arrange them in order from 1 to 5. Let's start!");
  };

  // Check if sequence is correct
  const checkSequence = (newDroppedNumbers: (number | null)[]) => {
    const isComplete = newDroppedNumbers.every(num => num !== null);
    if (isComplete) {
      const isCorrect = newDroppedNumbers.every((num, index) => num === index + 1);
      if (isCorrect) {
        setTrainMoving(true);
        speak("Awesome! You arranged the train perfectly! Get ready for a surprise!");
        setTimeout(() => {
          setShowSuccess(true);
          speak("Here are some yummy candies for you!");
        }, 3000); // Duration of the train animation
      } else {
        setShowError(true);
        speak("Oops! That's not quite right. Remember, first comes 1, then 2, then 3, then 4, and finally 5. Try again!");
      }
    }
  };

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setCurrentDroppedTarget(null);
    if (draggedNumber === null) return;

    const newDroppedNumbers = [...droppedNumbers];
    const newGameNumbers = [...gameNumbers];

    if (draggedFromDroppedZone) {
      // Dragging a car from one drop zone to another
      const targetNumber = newDroppedNumbers[targetIndex];
      newDroppedNumbers[targetIndex] = draggedNumber;
      if (draggedSourceIndex !== null) {
        newDroppedNumbers[draggedSourceIndex] = targetNumber;
      }
      speak(`You moved train car number ${draggedNumber}.`);
    } else {
      // Dragging a car from the bottom row to a drop zone
      const targetNumber = newDroppedNumbers[targetIndex];
      newDroppedNumbers[targetIndex] = draggedNumber;

      if (targetNumber !== null) {
        // Swapping with a car from the bottom row
        const gameNumberIndex = newGameNumbers.findIndex(n => n === draggedNumber);
        if (gameNumberIndex > -1) {
          newGameNumbers[gameNumberIndex] = targetNumber;
        }
        speak(`You swapped train car number ${draggedNumber} with number ${targetNumber}.`);
      } else {
        // Simply removing from the bottom row
        const gameNumberIndex = newGameNumbers.findIndex(n => n === draggedNumber);
        if (gameNumberIndex > -1) {
          newGameNumbers.splice(gameNumberIndex, 1);
        }
        speak(`You placed train car number ${draggedNumber} in position ${targetIndex + 1}.`);
      }
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
    onDragStart?: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  }> = ({ number, colors, isDropZone = false, isEmpty = false, isAvailable = false, isDragged = false, isDropTarget = false, onDragStart }) => (
    <div
      className={`relative transition-all duration-300 ${isDragged ? 'scale-110 z-10' : ''} ${
        isAvailable || (isDropZone && !isEmpty) ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDropTarget ? 'scale-105' : ''}`}
      draggable={!isEmpty}
      onDragStart={onDragStart}
      onTouchStart={onDragStart}
      onDragEnd={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      {/* Main car body */}
      <div className={`
        ${isEmpty ? 'border-4 border-dashed border-gray-400 bg-gray-100' :
          `bg-gradient-to-b ${colors.main} border-4 ${colors.border}`}
        rounded-lg w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-18 flex items-center justify-center shadow-lg
        hover:shadow-xl transform hover:scale-105 transition-all duration-200
      `}>
        {isEmpty || number === null ? (
          <div className="text-xs text-gray-500 text-center leading-tight">Drop<br />Here</div>
        ) : (
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{number}</div>
        )}
      </div>

      {/* Wheels */}
      <div className={`absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 ${
        isEmpty ? 'bg-gray-300 border-gray-400' : 'bg-gray-800 border-gray-900'
      } rounded-full border-2`}></div>
      <div className={`absolute -bottom-1 sm:-bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 ${
        isEmpty ? 'bg-gray-300 border-gray-400' : 'bg-gray-800 border-gray-900'
      } rounded-full border-2`}></div>

      {/* Car roof */}
      <div className={`absolute -top-1 sm:-top-2 left-0.5 sm:left-1 right-0.5 sm:right-1 h-2 sm:h-3 ${
        isEmpty ? 'bg-gray-200 border-gray-400 border-dashed' :
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
      <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-4">
              🚂 Train Number Game 🚂
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
              Help arrange the colorful train cars in the right order!
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Drag a train car and drop it into a spot on the track to place it in sequence: 1, 2, 3, 4, 5
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={initializeGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                Start Game! 🎮
              </button>

              <button
                onClick={() => speak("Welcome to the Train Number Game! You will drag colorful train cars to arrange them in order from 1 to 5. Each car has a different color and you need to put them in the right sequence. Have fun!")}
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
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 transition-colors duration-300 p-2 sm:p-4">
      <style>
        {`
        @keyframes move-forward {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100vw);
          }
        }
        .animate-move-forward {
          animation: move-forward 3s ease-in-out forwards;
        }
        `}
      </style>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform animate-bounce max-w-sm mx-auto">
            <div className="text-4xl sm:text-6xl mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Awesome!</h2>
            <div className="text-2xl sm:text-4xl mb-4">🍭🍬🍪🧁🍰</div>
            <p className="text-lg sm:text-xl text-gray-700 mb-4">Great job arranging the train!</p>
            <button
              onClick={initializeGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all"
            >
              Play Again! 🔄
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl max-w-sm mx-auto">
            <div className="text-4xl sm:text-6xl mb-4">🤔</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mb-4">Oops!</h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-4">Not quite right! Remember:</p>
            <p className="text-base sm:text-lg text-blue-600 font-semibold mb-4">
              First comes 1, then 2, then 3, then 4, and finally 5!
            </p>
            <button
              onClick={initializeGame}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all"
            >
              Try Again! 💪
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-center text-blue-800 mb-4 sm:mb-8 mt-12 sm:mt-4">
          🚂 Arrange the Colorful Train Cars! 🚂
        </h1>

        {/* Engine and Train Cars */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6 overflow-x-auto pb-4">
            <div className={`flex items-center gap-1 sm:gap-2 min-w-max px-4 ${trainMoving ? 'animate-move-forward' : ''}`}>
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
                >
                  <TrainCar
                    number={number}
                    colors={number !== null ? trainCarColors[number] : {} as TrainCarColors}
                    isDropZone={true}
                    isEmpty={number === null}
                    isDragged={draggedFromDroppedZone && draggedNumber === number}
                    onDragStart={(e) => handleDragStart(e, number as number, true, index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Numbers as Train Cars */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-700 mb-4">
            Drag these colorful train cars:
          </h2>

          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap px-4">
            {gameNumbers.map((number) => (
              <TrainCar
                key={number}
                number={number}
                colors={trainCarColors[number]}
                isAvailable={true}
                isDragged={!draggedFromDroppedZone && draggedNumber === number}
                onDragStart={(e) => handleDragStart(e, number as number, false, null)}
              />
            ))}
          </div>

          {gameNumbers.length === 0 && !showSuccess && !showError && (
            <p className="text-base sm:text-lg text-gray-600 mt-4">
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
            onClick={() => speak("Remember, arrange the train cars in order: Pink car with number 1 first, then purple car with 2, yellow car with 3, green car with 4, and finally orange car with 5!")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
            disabled={isSpeaking}
          >
            {isSpeaking ? '🔊 Speaking...' : '🔊 Help'}
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center bg-white bg-opacity-70 rounded-lg p-4 mx-4 sm:mx-0">
          <p className="text-sm sm:text-lg text-gray-700">
            <span className="font-bold">How to play:</span> Drag the colorful train cars and drop them on the empty spots in order:
            <span className="inline-block mx-1">🩷1</span>
            <span className="inline-block mx-1">💜2</span>
            <span className="inline-block mx-1">💛3</span>
            <span className="inline-block mx-1">💚4</span>
            <span className="inline-block mx-1">🧡5</span> 🎯
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;