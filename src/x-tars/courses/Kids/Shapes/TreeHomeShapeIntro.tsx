import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

// Sound effect functions using Web Audio API
const playSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
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

// Draggable Shape Component
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

  const handleDragStart = (e: React.DragEvent) => {
    if (isUsed) return;
    e.dataTransfer.setData("shapeType", type);
    setIsDragging(true);
  };

  const renderShape = () => {
    const color = shapeColors[type];
    
    switch (type) {
      case "circle":
        return <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />;
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "50px solid transparent",
              borderRight: "50px solid transparent",
              borderBottom: `86px solid ${color}`,
              margin: "0 auto",
            }}
          />
        );
      case "rectangle":
        return <div className="w-full h-20 my-2.5" style={{ backgroundColor: color }} />;
      case "star":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,10 61,40 95,40 68,60 79,90 50,70 21,90 32,60 5,40 39,40"
              fill={color}
            />
          </svg>
        );
      case "pentagon":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,15 90,40 75,85 25,85 10,40" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        draggable={!isUsed}
        onDragStart={handleDragStart}
        onDragEnd={() => setIsDragging(false)}
        className={`
          w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-4
          transition-all duration-300 ease-out
          ${!isUsed ? "cursor-grab active:cursor-grabbing hover:scale-110 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)]" : "opacity-40 cursor-not-allowed shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)]"}
          ${isDragging ? "opacity-50 scale-95" : ""}
        `}
      >
        {renderShape()}
      </div>
      <span className="text-sm font-bold text-gray-800">{label}</span>
    </div>
  );
};

// Drop Zone Component
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
      className={`
        absolute transition-all duration-300 ease-out
        ${!isMatched ? "border-4 border-dashed" : "border-0"}
        ${isOver ? "border-pink-500 bg-pink-100/20 scale-105" : "border-gray-800/30"}
        ${isMatched ? "animate-[fade-in_0.4s_ease-out]" : ""}
        ${className}
      `}
      style={style}
    >
      {label && !isMatched && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-pink-600 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

// Main Game Component
const Index = () => {
  const [matchedShapes, setMatchedShapes] = useState<Record<ShapeType, boolean>>({
    circle: false,
    triangle: false,
    rectangle: false,
    star: false,
    pentagon: false,
  });

  const matchedCount = Object.values(matchedShapes).filter(Boolean).length;

  const handleShapeDrop = (zone: ShapeType, droppedShape: ShapeType) => {
    if (zone === droppedShape) {
      setMatchedShapes((prev) => ({ ...prev, [zone]: true }));
      playCorrectSound();
      toast.success("Perfect match! 🎉", {
        description: `You found the ${zone}!`,
      });

      if (matchedCount + 1 === 5) {
        setTimeout(() => {
          playCelebrationSound();
          toast.success("Congratulations! 🎊", {
            description: "You completed the picture!",
            duration: 5000,
          });
        }, 500);
      }
    } else {
      playIncorrectSound();
      toast.error("Try again! 🤔", {
        description: `That's not the right shape for this spot.`,
      });
    }
  };

  const handleReset = () => {
    setMatchedShapes({
      circle: false,
      triangle: false,
      rectangle: false,
      star: false,
      pentagon: false,
    });
    toast.info("Game reset! 🔄", {
      description: "Try matching all the shapes again!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-pink-600 drop-shadow-md">
            🎨 Drag Shapes to Complete the Picture! 🖼️
          </h1>
          <div className="inline-block bg-white px-8 py-4 rounded-full shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)]">
            <p className="text-2xl font-bold text-pink-600">
              Shapes Matched: {matchedCount} / {shapes.length}
            </p>
          </div>
        </div>

        {/* Game Scene */}
        <div className="relative w-full h-[500px] bg-gradient-to-b from-sky-300 to-sky-200 rounded-3xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Sun (Circle) */}
          <DropZone
            expectedShape="circle"
            onDrop={(shape) => handleShapeDrop("circle", shape)}
            isMatched={matchedShapes.circle}
            className="w-24 h-24 rounded-full top-16 right-32"
            label="Circle"
          />
          {matchedShapes.circle && (
            <div 
              className="absolute w-24 h-24 rounded-full top-16 right-32 animate-[scale-in_0.3s_ease-out]"
              style={{ backgroundColor: shapeColors.circle }}
            />
          )}

          {/* House */}
          <div className="absolute bottom-32 left-32 w-48 h-40">
            {/* House body */}
            <div className="absolute bottom-0 w-full h-32 bg-amber-100 rounded-lg" />

            {/* Windows */}
            <div className="absolute bottom-16 left-6 w-10 h-10 bg-sky-400 grid grid-cols-2 gap-0.5 p-0.5 rounded">
              <div className="bg-sky-200" />
              <div className="bg-sky-200" />
              <div className="bg-sky-200" />
              <div className="bg-sky-200" />
            </div>
            <div className="absolute bottom-16 right-6 w-10 h-10 bg-sky-400 grid grid-cols-2 gap-0.5 p-0.5 rounded">
              <div className="bg-sky-200" />
              <div className="bg-sky-200" />
              <div className="bg-sky-200" />
              <div className="bg-sky-200" />
            </div>

            {/* Door (Rectangle) */}
            <DropZone
              expectedShape="rectangle"
              onDrop={(shape) => handleShapeDrop("rectangle", shape)}
              isMatched={matchedShapes.rectangle}
              className="w-12 h-16 rounded-t-lg bottom-0 left-1/2 -translate-x-1/2"
              label="Rectangle"
            />
            {matchedShapes.rectangle && (
              <div 
                className="absolute w-12 h-16 rounded-t-lg bottom-0 left-1/2 -translate-x-1/2 animate-[scale-in_0.3s_ease-out]"
                style={{ backgroundColor: shapeColors.rectangle }}
              />
            )}

            {/* Roof (Triangle) */}
            <DropZone
              expectedShape="triangle"
              onDrop={(shape) => handleShapeDrop("triangle", shape)}
              isMatched={matchedShapes.triangle}
              className="w-56 h-24 -left-4 -top-12"
              label="Triangle"
            />
            {matchedShapes.triangle && (
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-12 animate-[scale-in_0.3s_ease-out]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "112px solid transparent",
                  borderRight: "112px solid transparent",
                  borderBottom: `96px solid ${shapeColors.triangle}`,
                }}
              />
            )}
          </div>

          {/* Mountain */}
          <div className="absolute bottom-32 left-[400px]">
            {/* Mountain body */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "80px solid transparent",
                borderRight: "80px solid transparent",
                borderBottom: "140px solid #cbd5e1",
              }}
            />

            {/* Mountain top (Pentagon) */}
            <DropZone
              expectedShape="pentagon"
              onDrop={(shape) => handleShapeDrop("pentagon", shape)}
              isMatched={matchedShapes.pentagon}
              className="w-16 h-16 -top-8 left-1/2 -translate-x-1/2"
              label="Pentagon"
            />
            {matchedShapes.pentagon && (
              <svg viewBox="0 0 100 100" className="absolute w-16 h-16 -top-8 left-1/2 -translate-x-1/2 animate-[scale-in_0.3s_ease-out]">
                <polygon
                  points="50,15 90,40 75,85 25,85 10,40"
                  fill={shapeColors.pentagon}
                />
              </svg>
            )}
          </div>

          {/* Tree */}
          <div className="absolute bottom-32 right-40 w-28 h-40">
            {/* Trunk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-24 bg-amber-800 rounded" />

            {/* Tree Foliage (Star) - positioned at top of trunk */}
            <DropZone
              expectedShape="star"
              onDrop={(shape) => handleShapeDrop("star", shape)}
              isMatched={matchedShapes.star}
              className="w-28 h-28 bottom-16 left-1/2 -translate-x-1/2"
              label="Star"
            />
            {matchedShapes.star && (
              <svg viewBox="0 0 100 100" className="absolute w-28 h-28 bottom-16 left-1/2 -translate-x-1/2 animate-[scale-in_0.3s_ease-out]">
                <polygon
                  points="50,10 61,40 95,40 68,60 79,90 50,70 21,90 32,60 5,40 39,40"
                  fill={shapeColors.star}
                />
              </svg>
            )}
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-green-500 to-green-600 rounded-b-3xl" />

          {/* Hills */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-green-400" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-green-400" />
        </div>

        {/* Draggable Shapes */}
        <div className="bg-indigo-500/90 backdrop-blur-sm rounded-3xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] p-8">
          <div className="flex flex-wrap justify-center gap-8">
            {shapes.map((shape) => (
              <DraggableShape
                key={shape.type}
                type={shape.type}
                label={shape.label}
                isUsed={matchedShapes[shape.type]}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleReset}
            size="lg"
            className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold text-xl px-12 py-6 rounded-full shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] hover:scale-105 transition-all duration-300"
          >
            🔄 Reset Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;