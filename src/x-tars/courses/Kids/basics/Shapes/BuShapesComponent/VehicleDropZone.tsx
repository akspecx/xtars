import { useState } from "react";
import { ShapeType } from "@/pages/Index";

export const DropZone = ({
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