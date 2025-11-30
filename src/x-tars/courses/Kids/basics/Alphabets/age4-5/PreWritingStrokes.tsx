import React, { useState, useRef } from 'react';

const strokes = [
  { id: 'vertical', name: 'Vertical Line', emoji: '|', path: 'M 50 20 L 50 80' },
  { id: 'horizontal', name: 'Horizontal Line', emoji: '—', path: 'M 20 50 L 80 50' },
  { id: 'circle', name: 'Circle', emoji: 'O', path: 'M 50 20 A 30 30 0 1 1 49.9 20' },
  { id: 'slant-right', name: 'Slant Right', emoji: '/', path: 'M 30 80 L 70 20' },
  { id: 'slant-left', name: 'Slant Left', emoji: '\\', path: 'M 30 20 L 70 80' },
  { id: 'curve', name: 'Curve', emoji: '⌒', path: 'M 20 50 Q 50 20 80 50' },
  { id: 'zigzag', name: 'Zigzag', emoji: '⚡', path: 'M 20 30 L 40 50 L 60 30 L 80 50' }
];

const PreWritingStrokes: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const current = strokes[currentIndex];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleComplete = () => {
    setScore(prev => prev + 1);
    clearCanvas();
    setCurrentIndex((currentIndex + 1) % strokes.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-6">✏️ Pre-Writing Strokes</h1>
        <div className="text-center mb-6"><div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-lg">Score: {score}</div></div>
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 text-center">
          <div className="text-6xl mb-2">{current.emoji}</div>
          <p className="text-2xl font-bold">{current.name}</p>
        </div>
        <div className="mb-6 p-4 bg-gray-100 rounded-2xl">
          <svg viewBox="0 0 100 100" className="w-full h-64 bg-white rounded-xl border-4 border-dashed border-gray-400">
            <path d={current.path} stroke="#9333ea" strokeWidth="3" fill="none" strokeDasharray="5,5" opacity="0.5" />
          </svg>
        </div>
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-64 bg-white rounded-xl border-4 border-purple-400 mb-4" onMouseDown={() => setIsDrawing(true)} onMouseUp={() => setIsDrawing(false)} onMouseMove={(e) => { if (isDrawing && canvasRef.current) { const ctx = canvasRef.current.getContext('2d'); if (ctx) { const rect = canvasRef.current.getBoundingClientRect(); ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); ctx.stroke(); } } }} />
        <div className="flex justify-center gap-4">
          <button onClick={clearCanvas} className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold">Clear</button>
          <button onClick={handleComplete} className="px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold">Done!</button>
        </div>
      </div>
    </div>
  );
};

export default PreWritingStrokes;

