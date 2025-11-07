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
// Note: Size here should be the piece size (e.g., 128 or 160)
const AppleEmojiPiece = ({ position, size }) => { 
  // Calculate scale factor relative to the original 100px piece size
  const scaleFactor = size / 100;
  // IMPORTANT FIX: Manual offset of -12, scaled proportionally by current size's factor.
  const offset = -12 * scaleFactor; 

  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-white"
      style={{ 
        width: size, 
        height: size,
      }}
    >
      {/* The inner div holds the full 2x size emoji and is offset via position.x/y and the manual offset */}
      <div 
        className="absolute"
        style={{
          width: size * 2,
          height: size * 2,
          // Apply the position offset plus the manual adjustment, scaled by current size
          left: position.x * scaleFactor + offset, 
          top: position.y * scaleFactor + offset,
          fontSize: `${size * 2}px`, // Sets the emoji size to 2x the piece size
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
  // Define responsive sizes for the piece/slot (128px mobile, 160px desktop)
  const pieceSizeClass = 'w-32 h-32 sm:w-40 sm:h-40'; 
  const pieceSizeDesktop = 160; // Use the largest size for the AppleEmojiPiece calculation

  // Ensure we find the piece data before attempting to render it
  const pieceData = pieceId !== null ? initialPuzzlePieces.find(p => p.id === pieceId) : null;

  return (
    <div
      onDrop={(e) => onDrop(e, slotId)}
      onDragOver={onDragOver}
      // Use responsive size classes here
      className={`${pieceSizeClass} border-4 border-dashed rounded-lg flex items-center justify-center
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
          {/* Pass the largest piece size (160) for calculation. Tailwind handles the scaling. */}
          <AppleEmojiPiece position={pieceData.position} size={pieceSizeDesktop} /> 
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
  const [isSolved, setIsSolved] = useState(false); // New state to track if puzzle is solved but success screen is delayed
  const [steps, setSteps] = useState(0);
  const [slots, setSlots] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [showHint, setShowHint] = useState(false);

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
    const isSolvedCheck = initialPuzzlePieces.every(piece => 
      initialSlots[piece.correctSlot] === piece.id
    );

    // If solved on first shuffle, re-shuffle until it's not solved
    if (isSolvedCheck) {
        return initializeGame();
    }
    
    setSlots(initialSlots);
    setIsGameWon(false);
    setIsSolved(false); // Reset solved state
    setSteps(0);
    setShowHint(false); // Hide hint on new game
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
    
    // If the puzzle was solved, moving a piece breaks the solved state
    if (isSolved || isGameWon) {
        setIsSolved(false);
        setIsGameWon(false);
    }

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
  
  // Effect to check for puzzle completion and handle the 5-second delay
  useEffect(() => {
    // Only return if the game is not started or already won.
    if (!isGameStarted || isGameWon) return; 

    // Check if every piece is in its correct slot
    const isCorrectlyAssembled = initialPuzzlePieces.every(piece => 
      slots[piece.correctSlot] === piece.id
    );

    // FIX: Only trigger the solved process if assembled AND NOT already solved
    if (isCorrectlyAssembled && !isSolved) { 
      
      setIsSolved(true); // Mark as solved immediately
      
      // Announce solve attempt 
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Puzzle Solved!`);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }

      // Delay showing the win message for 5 seconds (user's requested feature)
      const timeoutId = setTimeout(() => {
        setIsGameWon(true); // Show the final popup
        
        // Final win announcement
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`Congratulations! You solved the puzzle in ${steps} moves!`);
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
      }, 5000); // 5 second delay

      // Cleanup function to clear timeout if component unmounts or state changes
      return () => clearTimeout(timeoutId);
    }
  }, [slots, isGameStarted, isGameWon, steps]); // FIX: Removed 'isSolved' from dependencies to prevent early timer cleanup

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

        {/* Start Screen */}
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

            {/* Puzzle Slots (Enlarged and Responsive) */}
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-xl shadow-2xl puzzle-card border-4 border-dashed border-gray-400 flex flex-col items-center w-full max-w-fit mx-auto">
                <h2 className="text-xl font-bold mb-4">Solve the Puzzle</h2>
                
                {/* 2x2 Grid of Slots - Responsive container for the enlarged pieces */}
                <div className="grid grid-cols-2 gap-0 w-64 h-64 sm:w-80 sm:h-80">
                  {Object.entries(slots).map(([slotIdStr, pieceId]) => {
                    const slotId = parseInt(slotIdStr);
                    const isCorrect = pieceId !== null && initialPuzzlePieces.find(p => p.id === pieceId)?.correctSlot === slotId;
                    
                    return (
                      <DroppableSlot
                        key={slotId}
                        slotId={slotId}
                        // Disable drag/drop if the puzzle is solved and we're waiting for the win screen
                        pieceId={pieceId}
                        isCorrect={isCorrect}
                        // Drag/Drop logic is enabled only if the solved state is NOT active
                        onDrop={!isSolved ? handleDrop : () => {}} 
                        onDragOver={handleDragOver}
                        onDragStart={!isSolved ? handleDragStart : (e) => e.preventDefault()} 
                      />
                    );
                  })}
                </div>
              </div>

              {/* Conditional Hint Display (Enlarged and Responsive) */}
              {showHint && (
                <div className="mt-4 p-4 rounded-xl shadow-xl bg-white/70 dark:bg-slate-700/70 border-2 border-green-500">
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Hint Image</h3>
                  {/* Hint container size matches the puzzle grid size (256px mobile, 320px desktop) */}
                  <div className="w-64 h-64 sm:w-80 sm:h-80 shadow-inner relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center">
                    {/* The full emoji, sized to match the container (256px mobile, 320px desktop) */}
                    <div className="text-[256px] sm:text-[320px] leading-none">🍎</div>
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
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`
                }
                disabled={isSolved}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              {/* Reset Button (FIX: Removed disabled={isSolved}) */}
              <button
                onClick={initializeGame}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg"
              >
                Reset Puzzle
              </button>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;