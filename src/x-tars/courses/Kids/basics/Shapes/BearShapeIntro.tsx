import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const ShapeMatchingGame = () => {
  const shapes = [
    { id: 'circle', name: 'Circle', color: '#FF6B6B', path: 'M 50 25 A 25 25 0 1 1 49.99 25' },
    { id: 'triangle', name: 'Triangle', color: '#4ECDC4', path: 'M 50 25 L 75 70 L 25 70 Z' },
    { id: 'rectangle', name: 'Rectangle', color: '#FFD93D', path: 'M 30 35 L 70 35 L 70 65 L 30 65 Z' },
    { id: 'star', name: 'Star', color: '#A78BFA', path: 'M 50 20 L 55 40 L 75 40 L 60 52 L 65 72 L 50 60 L 35 72 L 40 52 L 25 40 L 45 40 Z' }
  ];

  const [matched, setMatched] = useState({});
  const [draggedShape, setDraggedShape] = useState(null);
  const [celebrating, setCelebrating] = useState(null);
  const [shuffledShapes, setShuffledShapes] = useState([]);

  useEffect(() => {
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    setShuffledShapes(shuffled);
  }, []);

  const playSound = (shapeName) => {
    const utterance = new SpeechSynthesisUtterance(shapeName);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleDragStart = (shapeId) => {
    setDraggedShape(shapeId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (draggedShape === targetId && !matched[targetId]) {
      setMatched(prev => ({ ...prev, [targetId]: true }));
      const shape = shapes.find(s => s.id === targetId);
      playSound(shape.name);
      setCelebrating(targetId);
      setTimeout(() => setCelebrating(null), 1000);
    }
    setDraggedShape(null);
  };

  const allMatched = Object.keys(matched).length === shapes.length;

  const resetGame = () => {
    setMatched({});
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    setShuffledShapes(shuffled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-purple-700 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" size={40} />
            Shape Matching Game!
            <Sparkles className="text-yellow-400" size={40} />
          </h1>
          <p className="text-2xl text-purple-600 font-semibold">
            Help the bear find all the shapes! 🎯
          </p>
        </div>

        {/* Main Module - Bear Shape Board */}
        <div className="relative mb-12 flex justify-center">
          {/* Bear-shaped container */}
          <div className="relative">
            {/* Bear head - circular shape */}
            <div 
              className="relative bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full shadow-2xl p-12"
              style={{
                width: '700px',
                height: '650px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 -10px 30px rgba(0,0,0,0.2)'
              }}
            >
              {/* Left Ear */}
              <div 
                className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-xl"
                style={{
                  width: '140px',
                  height: '140px',
                  top: '-40px',
                  left: '80px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 -5px 15px rgba(0,0,0,0.2)'
                }}
              >
                <div className="absolute inset-6 bg-orange-200 rounded-full"></div>
              </div>
              
              {/* Right Ear */}
              <div 
                className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-xl"
                style={{
                  width: '140px',
                  height: '140px',
                  top: '-40px',
                  right: '80px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 -5px 15px rgba(0,0,0,0.2)'
                }}
              >
                <div className="absolute inset-6 bg-orange-200 rounded-full"></div>
              </div>
              
              {/* Eyes */}
              <div className="absolute flex gap-32 left-1/2 transform -translate-x-1/2" style={{ top: '60px' }}>
                <div className="w-20 h-24 bg-white rounded-full shadow-lg flex items-center justify-center"
                     style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}>
                  <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                </div>
                <div className="w-20 h-24 bg-white rounded-full shadow-lg flex items-center justify-center"
                     style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}>
                  <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              
              {/* Nose */}
              <div 
                className="absolute bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-xl left-1/2 transform -translate-x-1/2"
                style={{
                  width: '60px',
                  height: '50px',
                  top: '150px',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
                }}
              ></div>
              
              {/* Smile */}
              <div 
                className="absolute border-b-8 border-gray-700 rounded-b-full left-1/2 transform -translate-x-1/2"
                style={{
                  width: '100px',
                  height: '50px',
                  top: '180px'
                }}
              ></div>

              {/* Shape slots */}
              <div className="absolute grid grid-cols-4 gap-5 left-1/2 transform -translate-x-1/2" style={{ top: '280px', width: '600px' }}>
                {shapes.map((shape) => (
                  <div
                    key={shape.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(shape.id)}
                    className={`relative flex items-center justify-center transition-all duration-300 ${
                      celebrating === shape.id ? 'animate-pulse scale-110' : ''
                    }`}
                    style={{
                      width: '130px',
                      height: '130px',
                      borderRadius: '20px',
                      background: matched[shape.id] 
                        ? 'linear-gradient(145deg, #86efac, #a7f3d0)' 
                        : 'linear-gradient(145deg, #0e7490, #0891b2)',
                      boxShadow: 'inset 8px 8px 16px #06475a, inset -8px -8px 16px #14a2c2'
                    }}
                  >
                    {/* Empty carved slot - darker shadow */}
                    {!matched[shape.id] && (
                      <svg width="90" height="90" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>
                        <defs>
                          <filter id={`shadow-${shape.id}`}>
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                            <feOffset dx="0" dy="4" result="offsetblur"/>
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="0.5"/>
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        <path 
                          d={shape.path} 
                          fill="#064e5a" 
                          stroke="#043944" 
                          strokeWidth="2"
                          filter={`url(#shadow-${shape.id})`}
                          opacity="0.6"
                        />
                      </svg>
                    )}
                    
                    {matched[shape.id] && (
                      <>
                        <svg width="90" height="90" viewBox="0 0 100 100" className="drop-shadow-2xl">
                          <path d={shape.path} fill={shape.color} stroke="white" strokeWidth="4" />
                        </svg>
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-xl animate-bounce border-4 border-white">
                          ✓
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Draggable Shapes - 3D Look */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-12 border-8 border-blue-400">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Drag These Shapes! 👆</h2>
          <div className="grid grid-cols-4 gap-8">
            {shuffledShapes.map((shape) => (
              <div
                key={`drag-${shape.id}`}
                draggable={!matched[shape.id]}
                onDragStart={() => handleDragStart(shape.id)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                  matched[shape.id]
                    ? 'opacity-30 cursor-not-allowed'
                    : 'cursor-grab hover:scale-110 active:cursor-grabbing active:scale-95'
                }`}
                style={{ 
                  background: `linear-gradient(145deg, ${shape.color}40, ${shape.color}20)`,
                  boxShadow: matched[shape.id] 
                    ? 'none' 
                    : `12px 12px 24px ${shape.color}30, -12px -12px 24px ${shape.color}10`
                }}
              >
                <div 
                  className="rounded-xl p-4 drop-shadow-2xl"
                  style={{
                    background: `linear-gradient(145deg, ${shape.color}, ${shape.color}dd)`,
                    boxShadow: `8px 8px 16px ${shape.color}80, -4px -4px 12px ${shape.color}40`
                  }}
                >
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <path d={shape.path} fill="white" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-2xl font-bold" style={{ color: shape.color }}>
                  {shape.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {allMatched && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-3xl p-12 text-center shadow-2xl animate-bounce border-8 border-white">
              <div className="text-8xl mb-6">🎉🐻🎉</div>
              <h2 className="text-6xl font-bold text-purple-700 mb-4">Amazing!</h2>
              <p className="text-3xl text-purple-600 font-semibold">You helped the bear find all shapes!</p>
              <button
                onClick={resetGame}
                className="mt-8 bg-purple-600 text-white px-8 py-4 rounded-full text-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Play Again! 🔄
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeMatchingGame;