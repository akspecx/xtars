import React, { useState, useCallback, useEffect } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

// --- CONFIGURATION ---
const MOVE_LIMIT = 7; // Maximum moves allowed to solve the puzzle

// Updated for 3x3 grid (9 pieces)
const initialPuzzlePieces = [
  // IDs 1-9, forming a 3x3 grid (300px x 300px total internal size)
  { id: 1, correctSlot: 1, position: { x: 0, y: 0 } }, 
  { id: 2, correctSlot: 2, position: { x: -100, y: 0 } }, 
  { id: 3, correctSlot: 3, position: { x: -200, y: 0 } },
  { id: 4, correctSlot: 4, position: { x: 0, y: -100 } },
  { id: 5, correctSlot: 5, position: { x: -100, y: -100 } },
  { id: 6, correctSlot: 6, position: { x: -200, y: -100 } },
  { id: 7, correctSlot: 7, position: { x: 0, y: -200 } },
  { id: 8, correctSlot: 8, position: { x: -100, y: -200 } },
  { id: 9, correctSlot: 9, position: { x: -200, y: -200 } },
];
const slotIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// --- Utility: Shuffle array ---
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Component: Giraffe Emoji Piece (Updated Emoji) ---
const GiraffeEmojiPiece = ({ position, size }) => { 
  const scaleFactor = size / 100;
  const offset = -12 * scaleFactor; 
  // Total emoji size must be 3x the piece size for a 3x3 grid
  const totalEmojiSize = size * 3; 

  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-white"
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <div 
        className="absolute"
        style={{
          width: totalEmojiSize,
          height: totalEmojiSize,
          left: position.x * scaleFactor + offset, 
          top: position.y * scaleFactor + offset,
          fontSize: `${totalEmojiSize}px`, 
          lineHeight: 1, 
        }}
      >
        🦒
      </div>
    </div>
  );
};

// --- Component: Droppable Puzzle Slot ---
const DroppableSlot = ({ slotId, pieceId, isCorrect, onDrop, onDragOver, onDragStart }) => {
  // Adjusted sizes for 3x3: w-24 h-24 on mobile (96px) and sm:w-32 sm:h-32 on desktop (128px) 
  const pieceSizeClass = 'w-24 h-24 sm:w-32 sm:h-32'; 
  const pieceSizeDesktop = 128; // Largest size for calculation

  const pieceData = pieceId !== null ? initialPuzzlePieces.find(p => p.id === pieceId) : null;

  return (
    <div
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={onDragOver}
      className={`${pieceSizeClass} border-4 border-dashed rounded-lg flex items-center justify-center
        transition-all duration-500 relative overflow-hidden
        ${pieceId !== null 
          ? (isCorrect ? 'border-green-500 bg-green-50 shadow-xl shadow-green-300' : 'border-red-500 bg-red-50 shadow-xl shadow-red-300') 
          : 'border-gray-300 dark:border-gray-600 bg-gray-100/50 dark:bg-gray-700/50'
        }
      `}
    >
      {pieceId !== null && pieceData ? (
        <div
          draggable
          onDragStart={(e) => onDragStart(e, pieceId)}
          className="cursor-move transition-all duration-300 transform hover:scale-105 active:cursor-grabbing w-full h-full"
        >
          <GiraffeEmojiPiece position={pieceData.position} size={pieceSizeDesktop} /> 
        </div>
      ) : (
        <span className="text-3xl font-bold text-gray-400 opacity-50">{slotId}</span>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const GiraffePuzzleGame = () => { // Changed component name
  const { isDarkMode } = useGameModule();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isSolved, setIsSolved] = useState(false); 
  const [isGameOver, setIsGameOver] = useState(false); 
  const [steps, setSteps] = useState(0);
  // Initial slots updated for 9 pieces
  const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null });
  const [showHint, setShowHint] = useState(false);


  const initializeGame = useCallback(() => {
    const pieceIds = initialPuzzlePieces.map(p => p.id);
    const shuffledPieceIds = shuffleArray(pieceIds);
    
    // Assign 9 pieces to 9 slots
    const initialSlots = {
      1: shuffledPieceIds[0], 2: shuffledPieceIds[1], 3: shuffledPieceIds[2],
      4: shuffledPieceIds[3], 5: shuffledPieceIds[4], 6: shuffledPieceIds[5],
      7: shuffledPieceIds[6], 8: shuffledPieceIds[7], 9: shuffledPieceIds[8],
    };
    
    const isSolvedCheck = initialPuzzlePieces.every(piece => 
      initialSlots[piece.correctSlot] === piece.id
    );

    if (isSolvedCheck) {
        return initializeGame();
    }
    
    setSlots(initialSlots);
    setIsGameWon(false);
    setIsSolved(false); 
    setSteps(0);
    setShowHint(false); 
    setIsGameStarted(true);
    setIsGameOver(false); // Reset Game Over state
  }, []);

  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData('pieceId', pieceId.toString());
    
    const sourceSlot = Object.entries(slots).find(([, id]) => id === pieceId);
    if (sourceSlot) {
      e.dataTransfer.setData('sourceSlotId', sourceSlot[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSlotId) => {
    e.preventDefault();
    const pieceId = parseInt(e.dataTransfer.getData('pieceId'));
    const sourceSlotIdStr = e.dataTransfer.getData('sourceSlotId');
    const sourceSlotId = sourceSlotIdStr ? parseInt(sourceSlotIdStr) : null;
    
    // Check if the game is over before proceeding
    if (isGameOver || isSolved || isGameWon) return; 
    if (isNaN(pieceId) || pieceId === 0 || sourceSlotId === null) return;
    
    if (isSolved || isGameWon) {
        setIsSolved(false);
        setIsGameWon(false);
    }

    let finalSlots = {}; // Temporary variable to hold the final state of slots after the drop

    setSlots(prevSlots => {
      const newSlots = { ...prevSlots };
      const currentPieceInTargetSlot = newSlots[targetSlotId];

      newSlots[targetSlotId] = pieceId;

      if (currentPieceInTargetSlot !== null) {
        newSlots[sourceSlotId] = currentPieceInTargetSlot;
      } else {
        newSlots[sourceSlotId] = null;
      }
      
      finalSlots = newSlots; // Capture the state for the check below

      return newSlots;
    });
    
    // Check for move limit and update steps
    setSteps(prev => {
        const newSteps = prev + 1;
        
        // Check if the puzzle is actually solved BEFORE checking game over, 
        // using the captured finalSlots from the setSlots update.
        const isSolvedAfterDrop = initialPuzzlePieces.every(piece => 
            finalSlots[piece.correctSlot] === piece.id
        );

        if (!isSolvedAfterDrop && newSteps >= MOVE_LIMIT) {
             setIsGameOver(true);
             if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(`Game Over. You ran out of moves.`);
                utterance.rate = 0.9;
                speechSynthesis.speak(utterance);
            }
        }
        return newSteps;
    });
  };
  
  // Effect to check for puzzle completion and handle the 5-second delay
  useEffect(() => {
    // Only return if the game is not started or already won or already over.
    if (!isGameStarted || isGameWon || isGameOver) return; 

    const isCorrectlyAssembled = initialPuzzlePieces.every(piece => 
      slots[piece.correctSlot] === piece.id
    );

    if (isCorrectlyAssembled && !isSolved) { 
      
      setIsSolved(true); 
      
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Puzzle Solved!`);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }

      const timeoutId = setTimeout(() => {
        setIsGameWon(true); 
        
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Congratulations! You solved the puzzle in ${steps} moves!`);
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
      }, 5000); 

      return () => clearTimeout(timeoutId);
    }
  }, [slots, isGameStarted, isGameWon, isGameOver, steps]); 

  const currentBackground = isDarkMode 
    ? 'bg-slate-900 text-gray-100' 
    : 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-lime-100 text-gray-800'; // Giraffe theme

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 font-sans ${currentBackground}`}>
      <style>
        {`
          .puzzle-card {
            background-color: ${isDarkMode ? '#1f2937' : '#ffffff'};
          }
        `}
      </style>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="flex justify-between items-center mb-6 pt-4">
          <h1 className={`text-2xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
            🦒 Giraffe Puzzle Challenge 🧩
          </h1>
        </div>

        {/* Start Screen */}
        {!isGameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`rounded-xl p-8 shadow-2xl text-center max-w-md w-full ${isDarkMode ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
              <h2 className="text-3xl font-bold text-yellow-500 mb-4">Reassemble the Giraffe! (3x3 Grid)</h2>
              <p className="text-lg mb-6">Move the 9 puzzle pieces until the giraffe is complete. You only have **{MOVE_LIMIT} moves**!</p>
              <button
                onClick={initializeGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-all shadow-lg hover:shadow-xl"
              >
                Start Puzzle
              </button>
            </div>
          </div>
        )}

        {isGameStarted && (
          <>
            <div className="mb-6 text-center">
              <p className="text-lg font-semibold">
                Moves: <span className={`font-extrabold ${isGameWon ? 'text-green-500' : (steps >= MOVE_LIMIT ? 'text-red-500' : 'text-yellow-500')}`}>{steps}</span> / {MOVE_LIMIT}
              </p>
            </div>

            {/* Puzzle Slots (Enlarged and Responsive) */}
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-xl shadow-2xl puzzle-card border-4 border-dashed border-gray-400 flex flex-col items-center w-full max-w-fit mx-auto">
                <h2 className="text-xl font-bold mb-4">Solve the Puzzle</h2>
                
                {/* 3x3 Grid of Slots - Responsive container for the enlarged pieces */}
                <div className="grid grid-cols-3 gap-0 w-72 h-72 sm:w-96 sm:h-96">
                  {Object.entries(slots).map(([slotIdStr, pieceId]) => {
                    const slotId = parseInt(slotIdStr);
                    const isCorrect = pieceId !== null && initialPuzzlePieces.find(p => p.id === pieceId)?.correctSlot === slotId;
                    
                    return (
                      <DroppableSlot
                        key={slotId}
                        slotId={slotId}
                        pieceId={pieceId}
                        isCorrect={isCorrect}
                        // Disable drag/drop if solved or game over
                        onDrop={!isSolved && !isGameOver ? handleDrop : () => {}} 
                        onDragOver={handleDragOver}
                        onDragStart={!isSolved && !isGameOver ? handleDragStart : (e) => e.preventDefault()} 
                      />
                    );
                  })}
                </div>
              </div>

              {/* Conditional Hint Display (Enlarged and Responsive) */}
              {showHint && (
                <div className="mt-4 p-4 rounded-xl shadow-xl bg-white/70 dark:bg-slate-700/70 border-2 border-green-500">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Hint Image (3x3)</h3>
                  {/* Hint container size matches the puzzle grid size (288px mobile, 384px desktop) */}
                  <div className="w-72 h-72 sm:w-96 sm:h-96 shadow-inner relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center">
                    {/* The full emoji, sized to match the container (3x piece size) */}
                    <div className="text-[288px] sm:text-[384px] leading-none">🦒</div> {/* Giraffe emoji */}
                  </div>
                </div>
              )}
            </div>

            <div className='flex justify-center gap-4 mt-8'>
              {/* Hint Button */}
              <button
                onClick={() => setShowHint(prev => !prev)}
                className={`font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg 
                  ${showHint 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' // Updated color
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`
                }
                disabled={isSolved || isGameOver}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              {/* Reset Button */}
              <button
                onClick={initializeGame}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg"
              >
                Reset Puzzle
              </button>
            </div>


            {isGameWon && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${isDarkMode ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                  <div className="text-4xl sm:text-6xl mb-4">✅🎉</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Puzzle Solved!</h2>
                  <p className={`text-lg sm:text-xl mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    You rebuilt the giraffe in <strong>{steps} moves</strong>!
                  </p>
                  <button
                    onClick={initializeGame}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all shadow-md"
                  >
                    Play Again! 🔄
                  </button>
                </div>
              </div>
            )}
            
            {/* Game Over Popup */}
            {isGameOver && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${isDarkMode ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                  <div className="text-4xl sm:text-6xl mb-4">❌💀</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
                  <p className={`text-lg sm:text-xl mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    You ran out of moves! The puzzle was not completed in **{MOVE_LIMIT} moves**.
                  </p>
                  <button
                    onClick={initializeGame}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all shadow-md"
                  >
                    Try Again! 🔄
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GiraffePuzzleGame;