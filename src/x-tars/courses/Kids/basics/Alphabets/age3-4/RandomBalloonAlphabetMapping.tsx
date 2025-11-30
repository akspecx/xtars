import React, { useState, useEffect, useCallback } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

// Utility function for shuffling an array (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const AlphabetBalloonGame = () => {
  const { isDarkMode } = useGameModule();
  
  // --- Game State Variables ---
  const [balloons, setBalloons] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(''); // Stores the letter to click next
  const [targetSequence, setTargetSequence] = useState([]); // Stores the 26 letters in random order
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [balloonCounter, setBalloonCounter] = useState(0);

  // --- Configuration ---
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // 26 distinct, BRIGHTER, high-contrast pastel colors for black text
  const colors = [
    '#FFC0CB', // Pink
    '#B0E0E6', // PowderBlue
    '#98FB98', // PaleGreen
    '#FFFFE0', // LightYellow
    '#DDA0DD', // Light Plum
    '#ADD8E6', // LightBlue
    '#F08080', // LightCoral
    '#FAFAD2', // LightGoldenrodYellow
    '#AFEEEE', // PaleTurquoise
    '#F5DEB3', // Wheat
    '#FFA07A', // LightSalmon
    '#FFDAB9', // PeachPuff
    '#F0E68C', // Khaki (Light)
    '#D8BFD8', // Thistle
    '#E0FFFF', // LightCyan
    '#F5FFFA', // MintCream
    '#E6E6FA', // Lavender
    '#90EE90', // LightGreen
    '#FFCC99', // LightOrange
    '#B0C4DE', // LightSteelBlue
    '#F0FFFF', // Azure
    '#FFEBCD', // BlanchedAlmond
    '#FAEBD7', // AntiqueWhite
    '#F0FFF0', // Honeydew
    '#DCDCDC', // Gainsboro
    '#F0F8FF'  // AliceBlue
  ];

  // Map alphabet to colors and current match status for the top bar UI
  const alphabetColors = alphabet.map((letter, index) => {
      const poppedIndex = targetSequence.indexOf(letter);
      // Check if its position in the targetSequence is before the current score
      return {
          letter,
          color: colors[alphabet.indexOf(letter)],
          matched: poppedIndex !== -1 && poppedIndex < score
      };
  });
  
  // --- Game Logic Functions ---

  /**
   * Spawns a single balloon with the given letter and a random speed.
   * Clears any existing balloons first.
   * @param {string} letterToSpawn - The letter for the balloon.
   */
  const spawnBalloon = useCallback((letterToSpawn) => {
    
    // Generate a random speed between 0.5 (slower) and 1.0 (slowest original speed)
    const randomSpeed = Math.random() * (1.0 - 0.5) + 0.5; 

    setBalloonCounter(prev => {
        const newId = prev + 1;
        
        const newBalloon = {
            id: newId,
            letter: letterToSpawn, 
            x: Math.random() * 80 + 10, // Random horizontal position (10% to 90%)
            y: -15, // Start off-screen at the bottom
            color: colors[alphabet.indexOf(letterToSpawn)],
            speed: randomSpeed // Dynamic movement speed
        };
        
        // CRITICAL: Overwrite the balloon array to ensure only ONE balloon is present
        setBalloons([newBalloon]);
        return newId;
    });
  }, [alphabet, colors]); // Reduced dependencies

  // 1. Balloon movement and Game Over check
  useEffect(() => {
    // This effect handles continuous movement and collision detection (Game Over).
    if (!gameStarted || gameOver || gameWon) return;

    const interval = setInterval(() => {
      setBalloons(prev => {
        // If there are no balloons (e.g., waiting for the 1-second delay), skip movement
        if (prev.length === 0) return prev; 
        
        return prev.map(balloon => {
          // Use the balloon's specific random speed for vertical movement
          const newY = balloon.y + balloon.speed;

          // Game Over Check: If the single balloon crosses the line (y > 75)
          if (newY > 75) {
            setGameOver(true);
            return null; // Marks for removal
          }

          return { ...balloon, y: newY };
        }).filter(balloon => balloon !== null);
      });
    }, 40); // Movement speed (40ms update interval for smooth motion)

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, gameWon]);

  // --- Event Handlers ---

  // Handles click on the alphabet button or the balloon itself
  const handleAlphabetClick = (letter) => {
    // Only allow interaction if the game is active and the letter matches the target
    if (letter !== currentTarget || gameOver || gameWon) return;

    setBalloons([]); // Pop the balloon instantly (remove from screen)
        
    const newScore = score + 1;
    setScore(newScore);

    if (newScore === 26) {
      setGameWon(true); // All letters matched
    } else {
      // Determine the next target from the random sequence array
      const nextTarget = targetSequence[newScore];
      setCurrentTarget(nextTarget);
      
      // Spawn next balloon after 1 second (1000ms)
      setTimeout(() => {
          // Only spawn if the game hasn't ended during the delay
          if (!gameOver && !gameWon) {
              spawnBalloon(nextTarget);
          }
      }, 1000); 
    }
  };

  // Resets and starts the game
  const startGame = () => {
    // 1. Generate Random Sequence
    const shuffledAlphabet = shuffleArray(alphabet);
    setTargetSequence(shuffledAlphabet);
    
    // Reset all states
    setBalloons([]);
    setScore(0);
    setGameOver(false); // CRITICAL: Reset game state for restart
    setGameWon(false);
    setGameStarted(true); 
    setBalloonCounter(0);

    // 2. Set the first random target and spawn it immediately
    const firstTarget = shuffledAlphabet[0];
    setCurrentTarget(firstTarget);
    
    // Spawn immediately (0ms delay) upon starting
    setTimeout(() => {
        // This spawn is now guaranteed to run correctly after the state resets.
        spawnBalloon(firstTarget); 
    }, 0);
  };

  // Resets the game to the initial menu state
  const resetGame = () => {
    setBalloons([]);
    setScore(0);
    setCurrentTarget('');
    setTargetSequence([]);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
    setBalloonCounter(0);
  };

  // --- Render UI ---
  return (
    <div className={`w-full min-h-screen h-full relative overflow-hidden font-sans pb-4 transition-colors duration-500 ${!isDarkMode ? 'bg-gradient-to-b from-blue-200 to-blue-400' : 'bg-gray-900'}`}>
      {/* Load Inter font for better typography */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
          /* Custom balloon animation for smooth movement (uses state for position update) */
          .balloon-move {
             transition: all 0.04s linear; /* Updated transition to match 40ms interval */
          }
        `}
      </style>

      {/* Game Header: Alphabet Targets and Score (Sticky at the top, z-10) */}
      <div className="sticky top-0 left-0 right-0 z-10 bg-blue-500/80 backdrop-blur-sm p-4 shadow-xl rounded-b-xl dark:bg-gray-800/90 dark:shadow-2xl transition-colors duration-500">
        
        {/* Theme is controlled globally; balloon colors remain bright regardless of mode */}

        <div className="flex flex-wrap justify-center gap-2">
          {alphabetColors.map(({ letter, color, matched }) => (
            <button
              key={letter}
              // Allow popping balloons by clicking the target letter in the UI
              onClick={() => handleAlphabetClick(letter)}
              disabled={matched || !gameStarted || gameOver || gameWon} // Only disable if matched or game not running
              className={`
                w-12 h-12 rounded-full font-black text-black text-xl shadow-md 
                transition-all duration-200 
                ${matched 
                   ? 'opacity-30 cursor-not-allowed' // Match makes it semi-transparent
                   : 'opacity-100 cursor-pointer hover:scale-105' // Fully opaque when active
                }
              `}
              // Set the background color to the letter's unique light color
              style={{ backgroundColor: color }} 
            >
              {letter}
            </button>
          ))}
        </div>
        
        {/* Score Display (Removed Next Target) */}
        <div className="text-center mt-4">
          <span className="text-white font-black text-xl bg-blue-800 bg-opacity-70 px-6 py-2 rounded-full shadow-lg dark:bg-gray-700/80 transition-colors duration-500">
            {gameOver || gameWon ? `Final Score: ${score}/26` : `Score: ${score}/26`}
          </span>
        </div>

        {/* Danger Line (where balloons should not cross) */}
        <div className="w-full h-1 bg-red-600 mt-4 shadow-[0_0_15px_rgba(255,0,0,0.8)]"></div>
      </div>

      {/* Balloon Rendering Area (Absolute positioning relative to the main viewport) */}
      {balloons.map(balloon => (
        <div
          key={balloon.id}
          className="absolute balloon-move cursor-pointer transform hover:scale-110 active:scale-95 transition-transform duration-100 ease-in-out z-5" 
          style={{
            // x position is percentage from left
            left: `${balloon.x}%`, 
            // Use 'bottom' property so that -15% starts it off-screen and it floats up.
            bottom: `${balloon.y}%`, 
            transform: 'translateX(-50%)',
          }}
          onClick={() => handleAlphabetClick(balloon.letter)}
        >
          {/* Balloon shape and design */}
          <div 
             className="w-12 h-16 md:w-16 md:h-20 rounded-t-full rounded-b-2xl shadow-xl flex items-center justify-center relative p-1"
             style={{ backgroundColor: balloon.color, transform: 'rotateX(10deg)' }}
          >
            <span className="text-black font-black text-2xl md:text-3xl"> 
              {balloon.letter}
            </span>
            {/* Knot and String */}
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-1 bg-gray-700 rounded-full dark:bg-gray-300"></div>
              <div className="w-px h-10 bg-gray-500/80 dark:bg-gray-400/80"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Game State Overlays (Start, Win, Lose) */}
      
      {/* Start screen */}
      {!gameStarted && !gameOver && !gameWon && (
        <OverlayCard 
          title="🎈 Alphabet Balloon Game"
          // Updated message to include clear, step-by-step instructions
          message={
            <>
              <p className="mb-3 font-semibold text-xl text-blue-800 dark:text-blue-300">Instructions:</p>
              <ol className="list-decimal list-inside text-left mx-auto max-w-xs space-y-3 font-medium text-gray-700 dark:text-gray-300">
                <li>Wait for a balloon to float up from the bottom.</li>
                <li>Click the balloon (or the matching letter button above) before it crosses the <span className="font-bold text-red-600">Red Line</span>!</li>
                <li>If correct, the next random target will appear after 1 second.</li>
                <li>If the balloon crosses the line, the game ends!</li>
              </ol>
            </>
          }
          button1Action={startGame}
          button1Text="Start Game"
          button1Color="bg-blue-500 hover:bg-blue-600"
        />
      )}

      {/* Game Over screen */}
      {gameOver && (
        <OverlayCard 
          title="Game Over!"
          titleColor="text-red-600"
          message={`A balloon crossed the red line! Final Score: ${score}/26`}
          // Both Try Again and Play Again buttons use startGame to fully reset
          button1Action={startGame} 
          button1Text="Try Again"
          button1Color="bg-blue-500 hover:bg-blue-600"
          button2Action={resetGame}
          button2Text="Main Menu"
          button2Color="bg-gray-500 hover:bg-gray-600"
        />
      )}

      {/* Success screen */}
      {gameWon && (
        <OverlayCard 
          title="🎉 Congratulations!"
          titleColor="text-green-600"
          message={`You've completed the entire alphabet! Perfect Score: 26/26`}
          button1Action={startGame}
          button1Text="Play Again"
          button1Color="bg-green-500 hover:bg-green-600"
          button2Action={resetGame}
          button2Text="Main Menu"
          button2Color="bg-gray-500 hover:bg-gray-600"
        />
      )}
    </div>
  );
};

// Simple reusable overlay component for game states
const OverlayCard = ({ title, titleColor = 'text-gray-800', message, button1Action, button1Text, button1Color, button2Action, button2Text, button2Color }) => (
  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-8 shadow-2xl text-center max-w-sm w-full transform transition-transform duration-300 scale-100 dark:bg-gray-800 dark:text-gray-100">
      <h1 className={`text-3xl font-extrabold mb-4 ${titleColor}`}>
        {title}
      </h1>
      <div className="text-gray-700 mb-6 text-lg dark:text-gray-200">
        {message}
      </div>
      <div className="flex flex-col space-y-3">
        <button
          onClick={button1Action}
          className={`${button1Color} text-white font-bold py-3 px-6 rounded-lg text-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02]`}
        >
          {button1Text}
        </button>
        {button2Action && (
          <button
            onClick={button2Action}
            className={`${button2Color} text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02]`}
          >
            {button2Text}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default AlphabetBalloonGame;
