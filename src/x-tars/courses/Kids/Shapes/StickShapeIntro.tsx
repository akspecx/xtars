import React, { useState, useEffect } from 'react';

interface Block {
  id: string;
  shape: 'circle' | 'square' | 'triangle' | 'pentagon' | 'rectangle';
  color: string;
  pegIndex: number | null;
  stackOrder: number;
}

const ShapeSortingGame = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [maxMoves, setMaxMoves] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const pegConfigs = [
    { shape: 'circle' as const, pegs: 1, x: 12 },
    { shape: 'square' as const, pegs: 4, x: 28 },
    { shape: 'rectangle' as const, pegs: 2, x: 44 },
    { shape: 'triangle' as const, pegs: 3, x: 60 },
    { shape: 'pentagon' as const, pegs: 5, x: 76 }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const newBlocks: Block[] = [];
    
    pegConfigs.forEach((config, idx) => {
      const numBlocks = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < numBlocks; i++) {
        newBlocks.push({
          id: `${idx}-${i}`,
          shape: config.shape,
          color: colors[Math.floor(Math.random() * colors.length)],
          pegIndex: null,
          stackOrder: 0
        });
      }
    });

    setBlocks(newBlocks.sort(() => Math.random() - 0.5));
    setMaxMoves(newBlocks.length);
  };

  const getPegPositions = (shape: string, pegs: number) => {
    if (shape === 'circle') return [[50, 50]];
    if (shape === 'square') return [[30, 30], [70, 30], [30, 70], [70, 70]];
    if (shape === 'rectangle') return [[35, 50], [65, 50]];
    if (shape === 'triangle') return [[50, 30], [35, 65], [65, 65]];
    if (shape === 'pentagon') return [
      [50, 25], [75, 45], [62, 75], [38, 75], [25, 45]
    ];
    return [];
  };

  const handleDragStart = (blockId: string) => {
    if (showGameOver || showSuccess) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (block && block.pegIndex === null) {
      setDraggedBlock(blockId);
    }
  };

  const handleDrop = (pegIndex: number) => {
    if (!draggedBlock || showGameOver || showSuccess) return;

    const block = blocks.find(b => b.id === draggedBlock);
    if (!block) return;

    const pegConfig = pegConfigs[pegIndex];
    
    // Increment moves for every drop attempt
    const newMoves = moves + 1;
    setMoves(newMoves);
    
    if (block.shape === pegConfig.shape) {
      const blocksOnPeg = blocks.filter(b => b.pegIndex === pegIndex);
      const newBlocks = blocks.map(b => {
        if (b.id === draggedBlock) {
          return { ...b, pegIndex, stackOrder: blocksOnPeg.length };
        }
        return b;
      });
      
      setBlocks(newBlocks);
      setScore(score + 10);

      const allPlaced = newBlocks.every(b => b.pegIndex !== null);
      if (allPlaced) {
        setShowSuccess(true);
      } else if (newMoves >= maxMoves) {
        // Used all moves but didn't complete
        setShowGameOver(true);
      }
    } else {
      // Wrong move - check if game over
      if (newMoves >= maxMoves) {
        setShowGameOver(true);
      }
    }

    setDraggedBlock(null);
  };

  const resetGame = () => {
    setScore(0);
    setMoves(0);
    setShowSuccess(false);
    setShowGameOver(false);
    initializeGame();
  };

  const renderBlock = (block: Block, size: number = 80, showPegs: boolean = false) => {
    const pegPositions = getPegPositions(block.shape, pegConfigs.find(p => p.shape === block.shape)?.pegs || 1);
    
    return (
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        {/* Pegs going through the block (only when on peg stand) */}
        {showPegs && pegPositions.map((pos, idx) => (
          <div
            key={`peg-${idx}`}
            className="absolute bg-gradient-to-b from-amber-600 to-amber-800 rounded-full"
            style={{
              width: '10px',
              height: `${size + 20}px`,
              left: `${pos[0]}%`,
              top: '0',
              transform: 'translateX(-50%)',
              zIndex: 1,
              boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          ></div>
        ))}
        
        {/* The actual block */}
        <div 
          className="absolute shadow-xl rounded-lg"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            backgroundColor: block.color,
            clipPath: block.shape === 'circle' ? 'circle(50%)' :
                     block.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                     block.shape === 'pentagon' ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' :
                     block.shape === 'rectangle' ? 'inset(15% 5% 15% 5% round 8px)' :
                     'none',
            border: '3px solid rgba(0,0,0,0.2)',
            zIndex: 2,
            position: 'relative'
          }}
        >
          {/* Peg holes - showing darkness through the holes */}
          {pegPositions.map((pos, idx) => (
            <div
              key={idx}
              className="absolute bg-gradient-to-br from-gray-900 to-black rounded-full"
              style={{
                width: block.shape === 'circle' ? '22px' : '18px',
                height: block.shape === 'circle' ? '22px' : '18px',
                left: `${pos[0]}%`,
                top: `${pos[1]}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.8)',
                border: '1px solid rgba(0,0,0,0.3)',
                zIndex: 3
              }}
            ></div>
          ))}
          
          {/* Wood texture overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
          }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Score Board */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold text-amber-800">Score: {score}</div>
          <div className="text-lg md:text-xl text-gray-600">Moves: {moves} / {maxMoves}</div>
          <button
            onClick={resetGame}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            New Game
          </button>
        </div>

        {/* Wooden Base with Pegs */}
        <div className="relative bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 rounded-3xl shadow-2xl p-6 md:p-8 mb-6 border-4 border-amber-500">
          {/* Wood grain texture */}
          <div className="absolute inset-0 opacity-20 rounded-3xl" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139, 69, 19, 0.3) 3px, rgba(139, 69, 19, 0.3) 6px)',
          }}></div>
          
          <div className="relative flex justify-around items-end" style={{ minHeight: '320px' }}>
            {pegConfigs.map((config, pegIndex) => (
              <div 
                key={pegIndex}
                className="flex flex-col items-center relative"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(pegIndex)}
              >
                {/* Base pegs (always visible) */}
                <div className="absolute bottom-0 flex gap-2 mb-4" style={{ zIndex: 0 }}>
                  {Array.from({ length: config.pegs }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-3 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full shadow-lg"
                      style={{ height: '180px' }}
                    ></div>
                  ))}
                </div>
                
                {/* Stacked blocks with pegs going through them */}
                <div className="flex flex-col-reverse items-center mb-2 gap-1 relative" style={{ zIndex: 10, paddingBottom: '4px' }}>
                  {blocks
                    .filter(b => b.pegIndex === pegIndex)
                    .sort((a, b) => a.stackOrder - b.stackOrder)
                    .map((block) => (
                      <div key={block.id} className="relative">
                        {renderBlock(block, 75, true)}
                      </div>
                    ))}
                </div>
                
                {/* Base plate */}
                <div className="w-24 h-4 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg shadow-md" style={{ zIndex: 15 }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Blocks */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Drag shapes to matching pegs:</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            {blocks.filter(b => b.pegIndex === null).map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => handleDragStart(block.id)}
                className="cursor-move hover:scale-110 transform transition-transform active:scale-95"
                style={{ opacity: draggedBlock === block.id ? 0.5 : 1 }}
              >
                {renderBlock(block, 95, false)}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-2xl max-w-md mx-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Perfect!</h2>
              <p className="text-xl md:text-2xl text-gray-700 mb-2">All shapes sorted!</p>
              <p className="text-lg md:text-xl text-gray-600 mb-6">Score: {score} | Moves: {moves}/{maxMoves}</p>
              <button
                onClick={resetGame}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-xl font-bold transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Game Over Message */}
        {showGameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-2xl max-w-md mx-4">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">Game Over!</h2>
              <p className="text-xl md:text-2xl text-gray-700 mb-2">Out of moves!</p>
              <p className="text-lg md:text-xl text-gray-600 mb-6">Score: {score} | Moves: {moves}/{maxMoves}</p>
              <button
                onClick={resetGame}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-xl font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeSortingGame;