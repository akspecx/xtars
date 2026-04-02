import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useProfile } from "../../../../../context/ProfileContext";

const ShapeMatchingGame = () => {
  const { activeProfile } = useProfile();
  const shapes = [
    { id: 'circle', name: 'Circle', color: '#FF6B6B', path: 'M 50 25 A 25 25 0 1 1 49.99 25' },
    { id: 'triangle', name: 'Triangle', color: '#4ECDC4', path: 'M 50 25 L 75 70 L 25 70 Z' },
    { id: 'rectangle', name: 'Rectangle', color: '#FFD93D', path: 'M 30 35 L 70 35 L 70 65 L 30 65 Z' },
    { id: 'star', name: 'Star', color: '#A78BFA', path: 'M 50 20 L 55 40 L 75 40 L 60 52 L 65 72 L 50 60 L 35 72 L 40 52 L 25 40 L 45 40 Z' }
  ];

  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [shuffledShapes, setShuffledShapes] = useState<any[]>([]);

  useEffect(() => {
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    setShuffledShapes(shuffled);
  }, []);

  const playSound = (shapeName: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(shapeName);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleDragStart = (shapeId: string) => {
    setDraggedShape(shapeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (draggedShape === targetId && !matched[targetId]) {
      setMatched(prev => ({ ...prev, [targetId]: true }));
      const shape = shapes.find(s => s.id === targetId);
      if (shape) playSound(shape.name);
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

  const isKids = activeProfile?.type === 'KIDS';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-6 md:mb-8 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-700 mb-2 md:mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400 w-8 h-8 md:w-10 md:h-10" />
            {isKids ? "SHAPE MATCH!" : "Shape Matching Game!"}
            <Sparkles className="text-yellow-400 w-8 h-8 md:w-10 md:h-10" />
          </h1>
          {!isKids && <p className="text-xl md:text-2xl text-purple-600 font-semibold">Help the bear find all the shapes! 🎯</p>}
        </div>

        <div className="relative mb-8 md:mb-12 flex justify-center w-full overflow-hidden">
          <div className="relative scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 flex items-center justify-center">
            <div 
              className="relative bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full shadow-2xl p-12 flex-none"
              style={{
                width: '700px',
                height: '650px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 -10px 30px rgba(0,0,0,0.2)'
              }}
            >
              <div className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-xl" style={{ width: '140px', height: '140px', top: '-40px', left: '80px', boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 -5px 15px rgba(0,0,0,0.2)' }}><div className="absolute inset-6 bg-orange-200 rounded-full"></div></div>
              <div className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-xl" style={{ width: '140px', height: '140px', top: '-40px', right: '80px', boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 -5px 15px rgba(0,0,0,0.2)' }}><div className="absolute inset-6 bg-orange-200 rounded-full"></div></div>
              <div className="absolute flex gap-32 left-1/2 transform -translate-x-1/2" style={{ top: '60px' }}><div className="w-20 h-24 bg-white rounded-full shadow-lg flex items-center justify-center" style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}><div className="w-12 h-12 bg-gray-800 rounded-full"></div></div><div className="w-20 h-24 bg-white rounded-full shadow-lg flex items-center justify-center" style={{ boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}><div className="w-12 h-12 bg-gray-800 rounded-full"></div></div></div>
              <div className="absolute bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-xl left-1/2 transform -translate-x-1/2" style={{ width: '60px', height: '50px', top: '150px', boxShadow: '0 6px 12px rgba(0,0,0,0.4)' }}></div>
              <div className="absolute border-b-8 border-gray-700 rounded-b-full left-1/2 transform -translate-x-1/2" style={{ width: '100px', height: '50px', top: '180px' }}></div>

              <div className="absolute grid grid-cols-4 gap-5 left-1/2 transform -translate-x-1/2" style={{ top: '280px', width: '600px' }}>
                {shapes.map((shape) => (
                  <div
                    key={shape.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(shape.id)}
                    className={`relative flex items-center justify-center transition-all duration-300 ${celebrating === shape.id ? 'animate-pulse scale-110' : ''}`}
                    style={{ width: '130px', height: '130px', borderRadius: '20px', background: matched[shape.id] ? 'linear-gradient(145deg, #86efac, #a7f3d0)' : 'linear-gradient(145deg, #0e7490, #0891b2)', boxShadow: 'inset 8px 8px 16px #06475a, inset -8px -8px 16px #14a2c2' }}
                  >
                    {!matched[shape.id] && (
                      <svg width="90" height="90" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>
                        <path d={shape.path} fill="#064e5a" stroke="#043944" strokeWidth="2" opacity="0.6" />
                      </svg>
                    )}
                    {matched[shape.id] && (
                      <>
                        <svg width="90" height="90" viewBox="0 0 100 100" className="drop-shadow-2xl"><path d={shape.path} fill={shape.color} stroke="white" strokeWidth="4" /></svg>
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-xl animate-bounce border-4 border-white">✓</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-[2rem] md:rounded-3xl shadow-2xl p-6 md:p-12 border-8 border-blue-400 w-full max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6 md:mb-8 font-poppins">
            {isKids ? "DRAG!" : "Drag These Shapes! 👆"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {shuffledShapes.map((shape) => (
              <div
                key={`drag-${shape.id}`}
                draggable={!matched[shape.id]}
                onDragStart={() => handleDragStart(shape.id)}
                className={`aspect-square w-full max-w-[150px] rounded-2xl flex flex-col items-center justify-center gap-2 md:gap-4 transition-all duration-300 ${matched[shape.id] ? 'opacity-30 cursor-not-allowed scale-90' : 'cursor-grab hover:scale-110 active:cursor-grabbing active:scale-95'}`}
                style={{ background: `linear-gradient(145deg, ${shape.color}40, ${shape.color}20)`, boxShadow: matched[shape.id] ? 'none' : `12px 12px 24px ${shape.color}30, -12px -12px 24px ${shape.color}10` }}
              >
                <div className="rounded-xl p-2 md:p-4 drop-shadow-2xl" style={{ background: `linear-gradient(145deg, ${shape.color}, ${shape.color}dd)`, boxShadow: `8px 8px 16px ${shape.color}80, -4px -4px 12px ${shape.color}40` }}>
                  <svg width="60" height="60" md-width="100" md-height="100" viewBox="0 0 100 100" className="w-12 h-12 md:w-20 md:h-20"><path d={shape.path} fill="white" stroke="white" strokeWidth="2" /></svg>
                </div>
                {!isKids && <span className="text-lg md:text-2xl font-bold font-poppins" style={{ color: shape.color }}>{shape.name}</span>}
              </div>
            ))}
          </div>
        </div>

        {allMatched && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl animate-bounce border-8 border-white max-w-lg w-full">
              <div className="text-6xl md:text-8xl mb-4 md:mb-6">🎉🐻🎉</div>
              <h2 className="text-4xl md:text-6xl font-black text-purple-700 mb-2 md:mb-4 uppercase tracking-tighter">Amazing!</h2>
              {!isKids && <p className="text-2xl text-purple-600 font-bold mb-6">You helped the bear find all shapes!</p>}
              <button
                onClick={resetGame}
                className="mt-4 md:mt-8 bg-purple-600 text-white px-10 py-5 rounded-full text-2xl font-black hover:bg-purple-700 transition-all shadow-xl active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 mx-auto"
              >
                <RotateCcw className="w-8 h-8" strokeWidth={3} />
                {!isKids && "Play Again!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeMatchingGame;