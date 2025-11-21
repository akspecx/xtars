import React, { useState, useCallback, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

// --- CONFIGURATION ---
const initialPuzzlePieces = [
  // Position coordinates represent the shift required for the 200x200 emoji to display the correct quadrant 
  // inside the 100x100 viewing window of the piece.
  { id: 1, correctSlot: 1, position: { x: 0, y: 0 } }, 
  { id: 2, correctSlot: 2, position: { x: -100, y: 0 } }, 
  { id: 3, correctSlot: 3, position: { x: 0, y: -100 } }, 
  { id: 4, correctSlot: 4, position: { x: -100, y: -100 } }, 
];
const slotIds = [1, 2, 3, 4];

// --- Utility: Shuffle array ---
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- Component: Apple Emoji Piece ---
const AppleEmojiPiece = ({ position, size = 100 }) => { 
  // IMPORTANT FIX: Increased manual offset to -12 to compensate for browser-specific
  // emoji baseline/padding issues that caused severe misalignment.
  const offset = -12; 

  // The outer div is the 100x100 viewing window, which clips the content (overflow: hidden).
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-white"
      style={{ 
        width: size, 
        height: size,
      }}
    >
      {/* The inner div holds the full 200x200 emoji and is offset via position.x/y and the manual offset */}
      <div 
        className="absolute"
        style={{
          width: size * 2,
          height: size * 2,
          // Apply the position offset plus the manual adjustment
          left: position.x + offset, 
          top: position.y + offset,
          fontSize: `${size * 2}px`, // Sets the emoji size to 200px
          lineHeight: 1, // Ensures precise vertical alignment
        }}
      >
        🍎
      </div>
    </div>
  );
};

// --- Component: Droppable Puzzle Slot ---
const DroppableSlot = ({ slotId, pieceId, isCorrect, onDrop, onDragOver, onDragStart }) => {
  // Ensure we find the piece data before attempting to render it
  const pieceData = pieceId !== null ? initialPuzzlePieces.find(p => p.id === pieceId) : null;

  return (
    <div
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={onDragOver}
      className={`w-[100px] h-[100px] border-4 border-dashed rounded-lg flex items-center justify-center
        transition-all duration-500 relative overflow-hidden
        ${pieceId !== null 
          ? (isCorrect ? 'border-green-500 bg-green-50 shadow-xl shadow-green-300' : 'border-red-500 bg-red-50 shadow-xl shadow-red-300') 
          : 'border-gray-300 dark:border-gray-600 bg-gray-100/50 dark:bg-gray-700/50'
        }
      `}
    >
      {/* Draggable Piece inside the slot */}
      {pieceId !== null && pieceData ? (
        <div
          draggable
          onDragStart={(e) => onDragStart(e, pieceId)}
          className="cursor-move transition-all duration-300 transform hover:scale-105 active:cursor-grabbing w-full h-full"
        >
          <AppleEmojiPiece position={pieceData.position} size={100} />
        </div>
      ) : (
        <span className="text-3xl font-bold text-gray-400 opacity-50">{slotId}</span>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [theme, setTheme] = useState('light');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null });

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const initializeGame = useCallback(() => {
    const pieceIds = initialPuzzlePieces.map(p => p.id);
    const shuffledPieceIds = shuffleArray(pieceIds);
    
    // Randomly assign the shuffled pieces to the 4 slots
    const initialSlots = {
      1: shuffledPieceIds[0],
      2: shuffledPieceIds[1],
      3: shuffledPieceIds[2],
      4: shuffledPieceIds[3],
    };
    
    // Ensure the puzzle is not accidentally solved on the first shuffle
    const isSolved = initialPuzzlePieces.every(piece => 
      initialSlots[piece.correctSlot] === piece.id
    );

    // If solved on first shuffle, re-shuffle until it's not solved
    if (isSolved) {
        return initializeGame();
    }
    
    setSlots(initialSlots);
    setIsGameWon(false);
    setSteps(0);
    setIsGameStarted(true);
  }, []);

  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData('pieceId', pieceId.toString());
    
    // Store the slot ID the piece came from, necessary for the move logic
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
    
    // Input validation
    if (isNaN(pieceId) || pieceId === 0 || sourceSlotId === null) return;

    setSlots(prevSlots => {
      const newSlots = { ...prevSlots };
      const currentPieceInTargetSlot = newSlots[targetSlotId];

      // Move piece from source to target
      newSlots[targetSlotId] = pieceId;

      // If the target slot was occupied, move its piece to the original source slot
      if (currentPieceInTargetSlot !== null) {
        newSlots[sourceSlotId] = currentPieceInTargetSlot;
      } else {
        // Otherwise, just clear the original source slot
        newSlots[sourceSlotId] = null;
      }

      return newSlots;
    });

    setSteps(prev => prev + 1);
  };
  
  // NOTE: handleDropToPool is removed as all pieces start in the slots.


  useEffect(() => {
    if (!isGameStarted || isGameWon) return;

    // Check if every piece is in its correct slot
    const isCorrectlyAssembled = initialPuzzlePieces.every(piece => 
      slots[piece.correctSlot] === piece.id
    );

    if (isCorrectlyAssembled) {
      setIsGameWon(true);
      // Announce win if speech synthesis is available
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Congratulations! You solved the puzzle in ${steps} moves!`);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    }
  }, [slots, isGameStarted, isGameWon, steps]);

  // NOTE: isPiecePlaced is no longer needed since all pieces start in the slots.

  const currentBackground = theme === 'dark' 
    ? 'bg-slate-900 text-gray-100' 
    : 'bg-gradient-to-br from-yellow-100 via-white to-red-100 text-gray-800';

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 font-sans ${currentBackground}`}>
      <style>
        {`
          .puzzle-card {
            background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
          }
        `}
      </style>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="flex justify-between items-center mb-6 pt-4">
          <h1 className={`text-2xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-yellow-400' : 'text-red-700'}`}>
            🍎 Apple Puzzle Challenge 🧩
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg transition-colors ${
              theme === 'dark' ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {!isGameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`rounded-xl p-8 shadow-2xl text-center max-w-md w-full ${theme === 'dark' ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
              <h2 className="text-3xl font-bold text-red-500 mb-4">Reassemble the Apple!</h2>
              <p className="text-lg mb-6">Move the puzzle pieces between the four slots until the apple is complete.</p>
              <button
                onClick={initializeGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-all shadow-lg hover:shadow-xl"
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
                Moves: <span className={`font-extrabold ${isGameWon ? 'text-green-500' : 'text-red-500'}`}>{steps}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="p-6 rounded-xl shadow-2xl puzzle-card border-4 border-dashed border-gray-400 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">1. Reference Image</h2>
                {/* Reference Image - 200x200 */}
                <div className="w-[200px] h-[200px] shadow-inner relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center">
                  <div className="text-[200px] leading-none">🍎</div>
                </div>
              </div>

              <div className="p-6 rounded-xl shadow-2xl puzzle-card border-4 border-dashed border-gray-400 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">2. Puzzle Slots</h2>
                {/* 2x2 Grid of 100x100 Slots */}
                <div className="grid grid-cols-2 gap-0">
                  {Object.entries(slots).map(([slotIdStr, pieceId]) => {
                    const slotId = parseInt(slotIdStr);
                    const isCorrect = pieceId !== null && initialPuzzlePieces.find(p => p.id === pieceId)?.correctSlot === slotId;
                    
                    return (
                      <DroppableSlot
                        key={slotId}
                        slotId={slotId}
                        pieceId={pieceId}
                        isCorrect={isCorrect}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragStart={handleDragStart} // Pass drag start handler to make pieces inside slots draggable
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3 (Puzzle Pieces Pool) is removed since all pieces start in the slots */}
            <div className="mt-8 text-center">
              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                All pieces are on the board. Swap them around to solve the puzzle!
              </p>
            </div>

            {isGameWon && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${theme === 'dark' ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
                  <div className="text-4xl sm:text-6xl mb-4">✅🎉</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Puzzle Solved!</h2>
                  <p className={`text-lg sm:text-xl mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    You rebuilt the apple in <strong>{steps} moves</strong>!
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

            <div className='text-center mt-6'>
              <button
                onClick={initializeGame}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg"
              >
                Reset Puzzle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;