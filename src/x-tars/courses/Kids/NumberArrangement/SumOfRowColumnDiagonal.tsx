import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Moon, Sun, CheckCircle, Eye, EyeOff, Shuffle } from 'lucide-react';

// Target sum for a 3x3 Magic Square (1+2+...+9) / 3 = 15
const INITIAL_GRID = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Different magic square configurations with different target sums
const MAGIC_SQUARE_CONFIGS = [
  {
    targetSum: 15,
    solution: [
      [2, 7, 6],
      [9, 5, 1],
      [4, 3, 8]
    ]
  },
  {
    targetSum: 18,
    solution: [
      [3, 8, 7],
      [10, 6, 2],
      [5, 4, 9]
    ]
  },
  {
    targetSum: 21,
    solution: [
      [4, 9, 8],
      [11, 7, 3],
      [6, 5, 10]
    ]
  },
  {
    targetSum: 24,
    solution: [
      [5, 10, 9],
      [12, 8, 4],
      [7, 6, 11]
    ]
  }
];

// --- Utility Functions ---

/**
 * Calculates the sum of all rows, columns, and diagonals for the 3x3 grid.
 * @param {number[][]} grid - The 3x3 grid of numbers (null or number).
 * @returns {object} An object containing all calculated sums.
 */
const calculateSums = (grid) => {
  const sums = {
    rows: grid.map(row => row.reduce((acc, val) => acc + (val || 0), 0)),
    cols: [0, 1, 2].map(j => grid.reduce((acc, row) => acc + (row[j] || 0), 0)),
    diag1: (grid[0][0] || 0) + (grid[1][1] || 0) + (grid[2][2] || 0), // Top-left to bottom-right
    diag2: (grid[0][2] || 0) + (grid[1][1] || 0) + (grid[2][0] || 0)  // Top-right to bottom-left
  };

  return {
    rows: sums.rows,
    cols: sums.cols,
    diag1: sums.diag1,
    diag2: sums.diag2
  };
};

/**
 * Generates a random magic square puzzle by removing numbers from a valid solution
 */
const generatePuzzle = (config) => {
  const puzzle = config.solution.map(row => [...row]);
  // Remove 4-6 random numbers to create a puzzle
  const cellsToRemove = 4 + Math.floor(Math.random() * 3);
  const removed = new Set();
  
  while (removed.size < cellsToRemove) {
    const row = Math.floor(Math.random() * 3);
    const col = Math.floor(Math.random() * 3);
    const key = `${row}-${col}`;
    if (!removed.has(key)) {
      removed.add(key);
      puzzle[row][col] = null;
    }
  }
  
  return puzzle;
};

// --- Component: Grid Cell Input ---

interface CellProps {
  value: number | null;
  rowIndex: number;
  colIndex: number;
  onChange: (rowIndex: number, colIndex: number, newValue: number | null) => void;
  isSolved: boolean;
  isRepeated: boolean;
  showSolution: boolean;
  solutionValue: number;
}

const GridCell: React.FC<CellProps> = ({ value, rowIndex, colIndex, onChange, isSolved, isRepeated, showSolution, solutionValue }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    if (rawValue === '') {
      onChange(rowIndex, colIndex, null);
      return;
    }
    
    const numValue = parseInt(rawValue); 
    
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
      onChange(rowIndex, colIndex, numValue);
    }
  };

  const inputClasses = isSolved ? 
    'border-green-500 text-green-700 dark:text-green-300' :
    isRepeated ?
    'border-orange-500 ring-4 ring-orange-300 text-orange-700 dark:text-orange-300 focus:ring-orange-400' :
    'border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 focus:ring-indigo-400';
    

  return (
    <div className="relative w-full h-full">
      <input
        type="number"
        value={value === null ? '' : value}
        onChange={handleChange}
        disabled={isSolved}
        className={`w-full h-full text-4xl sm:text-5xl text-center font-extrabold 
                    bg-gray-50 dark:bg-gray-700 border-2 transition-colors duration-200
                    focus:outline-none focus:ring-4 ${inputClasses}
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        min={1} 
        max={99}
      />
      {showSolution && value === null && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-3xl sm:text-4xl font-bold text-blue-500 dark:text-blue-400 opacity-50">
            {solutionValue}
          </span>
        </div>
      )}
    </div>
  );
};


// --- Component: Sum Display Block ---

interface SumBlockProps {
  sum: number;
  isDark: boolean;
  label: string;
  targetSum: number;
}

const SumBlock: React.FC<SumBlockProps> = ({ sum, isDark, label, targetSum }) => {
  const isCorrect = sum === targetSum;
  const isZero = sum === 0;

  let colorClass;
  if (isCorrect) {
    colorClass = 'bg-green-500 text-white shadow-md';
  } else if (isZero) {
    colorClass = isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500';
  } else {
    colorClass = 'bg-red-500 text-white shadow-md';
  }

  return (
    <div className={`p-2 rounded-lg text-center font-bold transition-all duration-300 ${colorClass} w-full`}>
      <div className="text-xs uppercase opacity-70 leading-none">{label}</div>
      <div className="text-xl sm:text-2xl leading-none">{sum}</div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const MagicSquareGame: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [grid, setGrid] = useState<typeof INITIAL_GRID>(INITIAL_GRID);
  const [showSolution, setShowSolution] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(MAGIC_SQUARE_CONFIGS[0]);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const resetGrid = useCallback(() => {
    setGrid(INITIAL_GRID.map(row => row.map(() => null)));
    setShowSolution(false);
  }, []);

  const newPuzzle = useCallback(() => {
    // Randomly select a configuration
    const randomConfig = MAGIC_SQUARE_CONFIGS[Math.floor(Math.random() * MAGIC_SQUARE_CONFIGS.length)];
    setCurrentConfig(randomConfig);
    setGrid(generatePuzzle(randomConfig));
    setShowSolution(false);
  }, []);

  const toggleSolution = useCallback(() => {
    setShowSolution(prev => !prev);
  }, []);

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, newValue: number | null) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      newGrid[rowIndex][colIndex] = newValue;
      return newGrid;
    });
  }, []);
  
  // Memoize sums
  const sums = useMemo(() => calculateSums(grid), [grid]);
  
  // Find repeated numbers for validation feedback
  const repeatedValues = useMemo(() => {
    const filledValues = grid.flat().filter(val => typeof val === 'number');
    const counts = filledValues.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts).filter(key => counts[key] > 1).map(Number);
  }, [grid]);

  // Check if the puzzle is solved
  const isPuzzleSolved = useMemo(() => {
      const { rows, cols, diag1, diag2 } = sums;
      const allSums = [...rows, ...cols, diag1, diag2];
      
      const allCellsFilled = grid.flat().every(val => typeof val === 'number' && val !== 0);
      const allSumsMatch = allSums.every(sum => sum === currentConfig.targetSum);
      
      return allCellsFilled && allSumsMatch && repeatedValues.length === 0;

  }, [grid, sums, repeatedValues, currentConfig.targetSum]);


  const currentBackground = theme === 'dark' 
    ? 'bg-slate-900 text-gray-100' 
    : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-800';

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 font-sans ${currentBackground}`}>
      <div className="max-w-xl mx-auto relative">
        <div className="flex justify-between items-center mb-6 pt-4">
          <h1 className={`text-2xl sm:text-4xl font-extrabold ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-800'} text-center w-full`}>
            ✨ Magic Square Challenge ✨
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg transition-colors absolute top-4 right-0 ${
              theme === 'dark' ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className={`p-4 sm:p-6 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <p className={`text-center text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Goal: Make all <strong>rows, columns, and diagonals</strong> sum to <strong>{currentConfig.targetSum}</strong>.
          </p>
          <div className='flex justify-center'>
             <p className={`text-sm mb-4 font-semibold ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                {repeatedValues.length > 0 && `🚫 Repeated numbers (1-9) found: ${repeatedValues.join(', ')}`}
            </p>
          </div>

          {/* Solved Message Popup */}
          {isPuzzleSolved && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${theme === 'dark' ? 'bg-green-800 text-white' : 'bg-white text-gray-800 border-4 border-green-500'}`}>
                  <div className="text-5xl sm:text-7xl mb-4 text-green-400"><CheckCircle size={70} /></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-green-300 mb-2">SOLVED!</h2>
                  <p className={`text-lg sm:text-xl mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    The sum of every line is <strong>{currentConfig.targetSum}</strong>.
                  </p>
                  <button
                    onClick={resetGrid}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all shadow-md"
                  >
                    Play Again 🔄
                  </button>
                </div>
            </div>
          )}

          {/* Grid Layout with Aligned Labels */}
          <div className="flex flex-col gap-2 items-center">
            
            {/* Top Row: Column Sums aligned with grid columns */}
            <div className='grid grid-cols-4 gap-2 w-full max-w-[450px]'>
                <div></div> {/* Empty space for row label column */}
                {sums.cols.map((sum, index) => (
                    <div key={`col-sum-top-${index}`} className='flex justify-center items-center'>
                        <SumBlock sum={sum} isDark={theme === 'dark'} label={`C${index + 1}`} targetSum={currentConfig.targetSum} />
                    </div>
                ))}
            </div>

            {/* Main Grid with Row Sums */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-[450px]">
                {grid.map((row, rIdx) => (
                    <React.Fragment key={rIdx}>
                        {/* Row label on the left */}
                        <div className='flex justify-center items-center'>
                            <SumBlock sum={sums.rows[rIdx]} isDark={theme === 'dark'} label={`R${rIdx + 1}`} targetSum={currentConfig.targetSum} />
                        </div>
                        {/* 3 Grid Cells */}
                        {row.map((cell, cIdx) => (
                            <div key={cIdx} className='aspect-square border-2 border-indigo-600 dark:border-indigo-400 rounded-lg overflow-hidden shadow-lg'>
                                <GridCell 
                                    value={cell}
                                    rowIndex={rIdx}
                                    colIndex={cIdx}
                                    onChange={handleCellChange}
                                    isSolved={isPuzzleSolved}
                                    isRepeated={repeatedValues.includes(cell)}
                                    showSolution={showSolution}
                                    solutionValue={currentConfig.solution[rIdx][cIdx]}
                                />
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
          
            {/* Diagonal Sums */}
            <div className='flex justify-center gap-4 mt-4 w-full max-w-[450px]'>
                <SumBlock sum={sums.diag1} isDark={theme === 'dark'} label="Diag ↘" targetSum={currentConfig.targetSum} />
                <SumBlock sum={sums.diag2} isDark={theme === 'dark'} label="Diag ↙" targetSum={currentConfig.targetSum} />
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={newPuzzle}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full text-base sm:text-lg transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <Shuffle size={20} />
              New Puzzle
            </button>
            <button
              onClick={toggleSolution}
              className={`font-bold py-2 px-6 rounded-full text-base sm:text-lg transition-all shadow-lg transform hover:scale-105 flex items-center gap-2 ${
                showSolution 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {showSolution ? <EyeOff size={20} /> : <Eye size={20} />}
              {showSolution ? 'Hide' : 'Show'} Solution
            </button>
            <button
              onClick={resetGrid}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full text-base sm:text-lg transition-all shadow-lg transform hover:scale-105"
            >
              Clear Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicSquareGame;