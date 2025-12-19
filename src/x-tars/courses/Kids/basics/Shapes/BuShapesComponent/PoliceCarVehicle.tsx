import { DropZone } from "./VehicleDropZone";
import { ShapeType } from "@/pages/Index";

interface PoliceCarVehicleProps {
  matchedShapes: Record<string, boolean>;
  handleShapeDrop: (zone: string, expectedShape: ShapeType, droppedShape: ShapeType) => void;
  shapeColors: Record<ShapeType, string>;
  renderShape: (type: ShapeType, color: string, size?: number) => JSX.Element;
  isWaving: boolean;
  showBubble: boolean;
}

export const PoliceCarVehicle = ({
  matchedShapes,
  handleShapeDrop,
  shapeColors,
  renderShape,
  isWaving,
  showBubble,
}: PoliceCarVehicleProps) => {
  return (
    <div className="relative w-[480px] h-[200px] bg-gradient-to-b from-blue-500 to-blue-600 rounded-[28px] shadow-[0_25px_50px_rgba(0,0,0,0.3)] border-[6px] border-blue-800">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute -top-24 left-8 bg-white rounded-2xl px-4 py-3 shadow-lg border-4 border-blue-600 animate-[scale-in_0.3s_ease-out] z-50">
          <p className="text-sm font-fredoka font-bold text-gray-800 whitespace-nowrap">
            👮 Can you match the shapes here?
          </p>
          <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-600 transform rotate-45"></div>
        </div>
      )}
      {/* Police Car Roof/Cabin */}
      <div className="absolute -top-6 left-16 right-16 h-14 bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-[20px] border-t-[6px] border-l-[6px] border-r-[6px] border-blue-800" />
      
      {/* Police Label */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-800 px-6 py-1 rounded-full border-4 border-white shadow-lg">
        <p className="text-white font-fredoka font-bold text-sm">POLICE</p>
      </div>
      
      {/* Police Light Bar */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 bg-black px-4 py-2 rounded-lg">
        <div className="w-8 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
        <div className="w-8 h-4 bg-blue-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.8)]" style={{ animationDelay: "0.5s" }} />
      </div>
      
      {/* Star Badge */}
      <div className="absolute top-6 left-8 text-4xl">⭐</div>
      
      {/* Driver Window - Pentagon Drop Zone */}
      <DropZone
        expectedShape="pentagon"
        onDrop={(shape) => handleShapeDrop("driverWindow", "pentagon", shape)}
        isMatched={matchedShapes.driverWindow}
        className="w-[85px] h-[75px] rounded-lg top-2 left-[180px]"
        label="Pentagon"
      />
      {!matchedShapes.driverWindow && (
        <div className="absolute top-2 left-[180px] w-[85px] h-[75px] flex items-center justify-center pointer-events-none bg-black/10 rounded-lg border-4 border-dashed border-purple-400">
          {renderShape("pentagon", "#d1d5db", 70)}
        </div>
      )}
      {matchedShapes.driverWindow && (
        <div className="absolute top-2 left-[180px] w-[85px] h-[75px] flex items-center justify-center rounded-lg animate-[scale-in_0.3s_ease-out] shadow-inner" style={{ backgroundColor: shapeColors.pentagon }}>
          {renderShape("pentagon", shapeColors.pentagon, 70)}
          
          {/* Police Officer in window */}
          <div className="absolute top-6 left-2 pointer-events-none z-20">
            <div className="w-6 h-6 bg-orange-800 rounded-full border-2 border-orange-900" />
            <div className="w-8 h-4 bg-blue-700 rounded-t-lg -ml-1 border-2 border-blue-800 mt-0.5" />
            <div className={`absolute -right-2 top-1 w-3 h-3 bg-orange-800 rounded-full origin-bottom ${isWaving ? "animate-wave" : ""}`} />
          </div>
        </div>
      )}
      
      {/* Side Window - Rectangle Drop Zone */}
      <DropZone
        expectedShape="rectangle"
        onDrop={(shape) => handleShapeDrop("window", "rectangle", shape)}
        isMatched={matchedShapes.window}
        className="w-[100px] h-[65px] rounded-lg top-6 right-[80px]"
        label="Rectangle"
      />
      {!matchedShapes.window && (
        <div className="absolute top-6 right-[80px] w-[100px] h-[65px] flex items-center justify-center pointer-events-none bg-black/10 rounded-lg border-4 border-dashed border-sky-400">
          {renderShape("rectangle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.window && (
        <div className="absolute top-6 right-[80px] w-[100px] h-[65px] flex items-center justify-center rounded-lg animate-[scale-in_0.3s_ease-out] shadow-inner" style={{ backgroundColor: shapeColors.rectangle }}>
          {renderShape("rectangle", shapeColors.rectangle, 90)}
        </div>
      )}

      {/* Police Door */}
      <div className="absolute bottom-4 left-[80px] w-[280px] h-[100px] bg-white rounded-lg border-4 border-blue-800">
        <div className="absolute top-4 left-4 text-blue-800 font-bold text-xs">
          POLICE
        </div>
        <div className="absolute top-1/2 left-4 text-2xl">👮</div>
      </div>

      {/* Oval Drop Zone - Police Badge */}
      <DropZone
        expectedShape="oval"
        onDrop={(shape) => handleShapeDrop("oval", "oval", shape)}
        isMatched={matchedShapes.oval}
        className="w-[60px] h-[80px] top-[80px] -left-[65px]"
        label="Oval"
      />
      {!matchedShapes.oval && (
        <div className="absolute top-[80px] -left-[65px] w-[60px] h-[80px] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-pink-400 rounded-full bg-black/10">
            {renderShape("oval", "#d1d5db", 55)}
          </div>
        </div>
      )}
      {matchedShapes.oval && (
        <div className="absolute top-[80px] -left-[65px] flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
          {renderShape("oval", shapeColors.oval, 55)}
        </div>
      )}

      {/* Wheels */}
      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel1", "circle", shape)}
        isMatched={matchedShapes.wheel1}
        className="w-24 h-24 rounded-full -bottom-12 left-[100px]"
        label="Circle"
      />
      {!matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[100px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[100px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel2", "circle", shape)}
        isMatched={matchedShapes.wheel2}
        className="w-24 h-24 rounded-full -bottom-12 right-[140px]"
        label="Circle"
      />
      {!matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[140px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[140px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      {/* Headlights */}
      <div className="absolute bottom-8 -left-2 w-6 h-8 bg-yellow-200 rounded-full border-2 border-yellow-600 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
      <div className="absolute top-[80px] -left-2 w-6 h-8 bg-red-400 rounded-full border-2 border-red-700 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
      
      {/* Police number */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 bg-white px-4 py-2 rounded-lg border-2 border-blue-800 font-bold text-blue-800">
        911
      </div>
    </div>
  );
};