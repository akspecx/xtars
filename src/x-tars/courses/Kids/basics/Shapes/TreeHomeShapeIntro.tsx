import React, { useState, useRef, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "./BuShapesComponent/button";
import { toast } from "sonner";
import { useProfile } from "../../../../../context/ProfileContext";

type ShapeType = "circle" | "triangle" | "rectangle" | "star" | "pentagon";

const shapes: { type: ShapeType; label: string }[] = [
  { type: "circle", label: "Circle" },
  { type: "triangle", label: "Triangle" },
  { type: "rectangle", label: "Rectangle" },
  { type: "star", label: "Star" },
  { type: "pentagon", label: "Pentagon" },
];

const shapeColors: Record<ShapeType, string> = {
  circle: "hsl(45 95% 60%)",
  triangle: "hsl(0 70% 55%)",
  rectangle: "hsl(25 50% 35%)",
  star: "hsl(120 50% 50%)",
  pentagon: "hsl(280 60% 55%)",
};

const getAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

const playSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
  try {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {}
};

const playCorrectSound = () => {
  playSound(523.25, 0.1); // C5
  setTimeout(() => playSound(659.25, 0.1), 100); // E5
  setTimeout(() => playSound(783.99, 0.15), 200); // G5
};

const playIncorrectSound = () => {
  playSound(200, 0.2, "sawtooth");
};

const playCelebrationSound = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => playSound(note, 0.15), index * 100);
  });
  setTimeout(() => {
    notes.reverse().forEach((note, index) => {
      setTimeout(() => playSound(note, 0.15), index * 80);
    });
  }, 500);
};

const DraggableShape = ({ 
  type, 
  label, 
  isUsed 
}: { 
  type: ShapeType; 
  label: string; 
  isUsed: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { activeProfile } = useProfile();

  const handleDragStart = (e: React.DragEvent) => {
    if (isUsed) return;
    e.dataTransfer.setData("shapeType", type);
    setIsDragging(true);
  };

  const renderShape = () => {
    const color = shapeColors[type];
    switch (type) {
      case "circle": return <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />;
      case "triangle": return <div style={{ width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: `86px solid ${color}`, margin: "0 auto" }} />;
      case "rectangle": return <div className="w-full h-20 my-2.5" style={{ backgroundColor: color }} />;
      case "star": return <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,10 61,40 95,40 68,60 79,90 50,70 21,90 32,60 5,40 39,40" fill={color} /></svg>;
      case "pentagon": return <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,15 90,40 75,85 25,85 10,40" fill={color} /></svg>;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        draggable={!isUsed}
        onDragStart={handleDragStart}
        onDragEnd={() => setIsDragging(false)}
        className={`w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center p-4 transition-all duration-300 ease-out ${!isUsed ? "cursor-grab active:cursor-grabbing hover:scale-110 shadow-lg" : "opacity-40 cursor-not-allowed"} ${isDragging ? "opacity-50 scale-95" : ""}`}
      >
        {renderShape()}
      </div>
      {activeProfile?.type !== 'KIDS' && <span className="text-sm font-bold text-gray-800">{label}</span>}
    </div>
  );
};

const DropZone = ({
  expectedShape,
  onDrop,
  isMatched,
  style,
  className = "",
  label,
}: {
  expectedShape: ShapeType;
  onDrop: (shape: ShapeType) => void;
  isMatched: boolean;
  style?: React.CSSProperties;
  className?: string;
  label?: string;
}) => {
  const [isOver, setIsOver] = useState(false);
  const { activeProfile } = useProfile();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMatched) setIsOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (!isMatched) {
      const droppedShape = e.dataTransfer.getData("shapeType") as ShapeType;
      onDrop(droppedShape);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`absolute transition-all duration-300 ease-out ${!isMatched ? "border-4 border-dashed" : "border-0"} ${isOver ? "border-pink-500 bg-pink-100/20 scale-105" : "border-gray-800/30"} ${isMatched ? "animate-[fade-in_0.4s_ease-out]" : ""} ${className}`}
      style={style}
    >
      {label && !isMatched && activeProfile?.type !== 'KIDS' && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-pink-600 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

const Index = () => {
  const { activeProfile } = useProfile();
  const [matchedShapes, setMatchedShapes] = useState<Record<ShapeType, boolean>>({
    circle: false, triangle: false, rectangle: false, star: false, pentagon: false,
  });

  const matchedCount = Object.values(matchedShapes).filter(Boolean).length;

  const handleShapeDrop = (zone: ShapeType, droppedShape: ShapeType) => {
    if (zone === droppedShape) {
      setMatchedShapes((prev) => ({ ...prev, [zone]: true }));
      playCorrectSound();
      toast.success("Perfect match! 🎉");

      if (matchedCount + 1 === 5) {
        setTimeout(() => {
          playCelebrationSound();
          toast.success("Congratulations! 🎊");
        }, 500);
      }
    } else {
      playIncorrectSound();
      toast.error("Try again! 🤔");
    }
  };

  const handleReset = () => {
    setMatchedShapes({ circle: false, triangle: false, rectangle: false, star: false, pentagon: false });
    toast.info("Game reset! 🔄");
  };

  const isKids = activeProfile?.type === 'KIDS';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center">
        
        <div className="text-center space-y-2 md:space-y-4 flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-pink-600 drop-shadow-md uppercase tracking-tighter">
            {isKids ? "BUILD THE SCENE!" : "🎨 Drag Shapes to Complete the Picture! 🖼️"}
          </h1>
          <div className="inline-block bg-white px-6 py-2 md:px-8 md:py-4 rounded-full shadow-lg border-2 border-pink-100">
            <p className="text-xl md:text-2xl font-black text-pink-600">
              ⭐ {matchedCount} / 5
            </p>
          </div>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-b from-sky-300 to-sky-200 rounded-[2rem] md:rounded-3xl shadow-xl overflow-hidden border-4 border-white scale-90 md:scale-100">
          <DropZone expectedShape="circle" onDrop={(s) => handleShapeDrop("circle", s)} isMatched={matchedShapes.circle} className="w-20 h-20 md:w-24 md:h-24 rounded-full top-12 md:top-16 right-20 md:right-32" label="Circle" />
          {matchedShapes.circle && <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full top-12 md:top-16 right-20 md:right-32 animate-[scale-in_0.3s_ease-out]" style={{ backgroundColor: shapeColors.circle }} />}

          <div className="absolute bottom-24 md:bottom-32 left-16 md:left-32 w-40 md:w-48 h-32 md:h-40">
            <div className="absolute bottom-0 w-full h-24 md:h-32 bg-amber-100 rounded-lg" />
            <div className="absolute bottom-12 md:bottom-16 left-4 md:left-6 w-8 md:w-10 h-8 md:h-10 bg-sky-400 grid grid-cols-2 gap-0.5 p-0.5 rounded"><div className="bg-sky-200" /><div className="bg-sky-200" /><div className="bg-sky-200" /><div className="bg-sky-200" /></div>
            <div className="absolute bottom-12 md:bottom-16 right-4 md:right-6 w-8 md:w-10 h-8 md:h-10 bg-sky-400 grid grid-cols-2 gap-0.5 p-0.5 rounded"><div className="bg-sky-200" /><div className="bg-sky-200" /><div className="bg-sky-200" /><div className="bg-sky-200" /></div>
            <DropZone expectedShape="rectangle" onDrop={(s) => handleShapeDrop("rectangle", s)} isMatched={matchedShapes.rectangle} className="w-10 h-14 md:w-12 md:h-16 rounded-t-lg bottom-0 left-1/2 -translate-x-1/2" label="Rectangle" />
            {matchedShapes.rectangle && <div className="absolute w-10 h-14 md:w-12 md:h-16 rounded-t-lg bottom-0 left-1/2 -translate-x-1/2 animate-[scale-in_0.3s_ease-out]" style={{ backgroundColor: shapeColors.rectangle }} />}
            <DropZone expectedShape="triangle" onDrop={(s) => handleShapeDrop("triangle", s)} isMatched={matchedShapes.triangle} className="w-48 md:w-56 h-20 md:h-24 -left-4 -top-10 md:-top-12" label="Triangle" />
            {matchedShapes.triangle && <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:-top-12 animate-[scale-in_0.3s_ease-out]" style={{ width: 0, height: 0, borderLeft: "96px md:border-left-112px solid transparent", borderRight: "96px md:border-right-112px solid transparent", borderBottom: `80px md:border-bottom-96px solid ${shapeColors.triangle}` }} />}
          </div>

          <div className="absolute bottom-24 md:bottom-32 left-80 md:left-[400px]">
            <div style={{ width: 0, height: 0, borderLeft: "60px md:border-left-80px solid transparent", borderRight: "60px md:border-right-80px solid transparent", borderBottom: "110px md:border-bottom-140px solid #cbd5e1" }} />
            <DropZone expectedShape="pentagon" onDrop={(s) => handleShapeDrop("pentagon", s)} isMatched={matchedShapes.pentagon} className="w-14 h-14 md:w-16 md:h-16 -top-6 md:-top-8 left-1/2 -translate-x-1/2" label="Pentagon" />
            {matchedShapes.pentagon && <svg viewBox="0 0 100 100" className="absolute w-14 h-14 md:w-16 md:h-16 -top-6 md:-top-8 left-1/2 -translate-x-1/2 animate-[scale-in_0.3s_ease-out]"><polygon points="50,15 90,40 75,85 25,85 10,40" fill={shapeColors.pentagon} /></svg>}
          </div>

          <div className="absolute bottom-24 md:bottom-32 right-20 md:right-40 w-24 md:w-28 h-32 md:h-40">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 md:w-8 h-20 md:h-24 bg-amber-800 rounded" />
            <DropZone expectedShape="star" onDrop={(s) => handleShapeDrop("star", s)} isMatched={matchedShapes.star} className="w-24 md:w-28 h-24 md:h-28 bottom-12 md:bottom-16 left-1/2 -translate-x-1/2" label="Star" />
            {matchedShapes.star && <svg viewBox="0 0 100 100" className="absolute w-24 md:w-28 h-24 md:h-28 bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 animate-[scale-in_0.3s_ease-out]"><polygon points="50,10 61,40 95,40 68,60 79,90 50,70 21,90 32,60 5,40 39,40" fill={shapeColors.star} /></svg>}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-b from-green-500 to-green-600 rounded-b-3xl shadow-inner" />
        </div>

        <div className="bg-indigo-500/90 backdrop-blur-sm rounded-[2rem] md:rounded-3xl shadow-xl p-6 md:p-8 w-full max-w-4xl border-4 border-white/20">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {shapes.map((shape) => (
              <DraggableShape key={shape.type} type={shape.type} label={shape.label} isUsed={matchedShapes[shape.type]} />
            ))}
          </div>
        </div>

        <div className="flex justify-center pb-8">
          <Button onClick={handleReset} size="lg" className="bg-white hover:bg-gray-100 text-pink-600 font-black text-xl px-12 py-8 rounded-full shadow-2xl hover:scale-105 transition-all border-4 border-white flex items-center gap-3">
            <RotateCcw className="w-8 h-8 md:w-10 md:h-10" />
            {!isKids && "Reset Game"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;