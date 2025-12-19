import { DropZone } from "./VehicleDropZone";
import { ShapeType } from "@/pages/Index";

interface SchoolBusVehicleProps {
  matchedShapes: Record<string, boolean>;
  handleShapeDrop: (zone: string, expectedShape: ShapeType, droppedShape: ShapeType) => void;
  shapeColors: Record<ShapeType, string>;
  renderShape: (type: ShapeType, color: string, size?: number) => JSX.Element;
  isWaving: boolean;
  showBubble: boolean;
}

export const SchoolBusVehicle = ({
  matchedShapes,
  handleShapeDrop,
  shapeColors,
  renderShape,
  isWaving,
  showBubble,
}: SchoolBusVehicleProps) => {
  return (
    <div className="relative w-[480px] h-[240px] bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-[32px] shadow-[0_25px_50px_rgba(0,0,0,0.3)] border-[6px] border-orange-500">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute -top-24 left-8 bg-white rounded-2xl px-4 py-3 shadow-lg border-4 border-yellow-400 animate-[scale-in_0.3s_ease-out] z-50">
          <p className="text-sm font-fredoka font-bold text-gray-800 whitespace-nowrap">
            🎯 Can you drag and drop the shapes?
          </p>
          <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white border-r-4 border-b-4 border-yellow-400 transform rotate-45"></div>
        </div>
      )}
      {/* Bus Top */}
      <div className="absolute -top-10 left-12 right-12 h-16 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-[32px] border-t-[6px] border-l-[6px] border-r-[6px] border-orange-500" />
      
      {/* School Bus Text */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 px-6 py-1 rounded-full border-4 border-white shadow-lg">
        <p className="text-white font-fredoka font-bold text-sm">SCHOOL BUS</p>
      </div>
      
      {/* Front Bumper */}
      <div className="absolute -left-2 top-8 w-3 h-32 bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-lg" />
      
      {/* Stripes */}
      <div className="absolute top-[60px] left-0 right-0 h-2 bg-orange-600" />
      <div className="absolute top-[160px] left-0 right-0 h-2 bg-orange-600" />
      
      {/* Driver Window - Pentagon Drop Zone */}
      <DropZone
        expectedShape="pentagon"
        onDrop={(shape) => handleShapeDrop("driverWindow", "pentagon", shape)}
        isMatched={matchedShapes.driverWindow}
        className="w-[85px] h-[85px] rounded-xl top-4 left-10"
        label="Pentagon"
      />
      {!matchedShapes.driverWindow && (
        <div className="absolute top-4 left-10 w-[85px] h-[85px] flex items-center justify-center pointer-events-none bg-black/10 rounded-xl border-4 border-dashed border-purple-400">
          {renderShape("pentagon", "#d1d5db", 70)}
        </div>
      )}
      {matchedShapes.driverWindow && (
        <div className="absolute top-4 left-10 w-[85px] h-[85px] flex items-center justify-center rounded-xl animate-[scale-in_0.3s_ease-out] shadow-inner" style={{ backgroundColor: shapeColors.pentagon }}>
          {renderShape("pentagon", shapeColors.pentagon, 70)}
          
          {/* Driver visible through window */}
          <div className="absolute top-8 left-2 pointer-events-none z-20">
            <div className="w-6 h-6 bg-orange-800 rounded-full border-2 border-orange-900" />
            <div className="w-8 h-4 bg-blue-600 rounded-t-lg -ml-1 border-2 border-blue-700 mt-0.5" />
            <div className={`absolute -right-2 top-1 w-3 h-3 bg-orange-800 rounded-full origin-bottom ${isWaving ? "animate-wave" : ""}`} />
          </div>
          
          {/* Steering Wheel */}
          <div className="absolute top-[42px] left-3 w-6 h-6 border-3 border-gray-800 rounded-full bg-gray-500 pointer-events-none z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full" />
          </div>
        </div>
      )}
      
      {/* Passenger Window - Rectangle Drop Zone */}
      <DropZone
        expectedShape="rectangle"
        onDrop={(shape) => handleShapeDrop("window", "rectangle", shape)}
        isMatched={matchedShapes.window}
        className="w-[120px] h-[75px] rounded-xl top-10 left-[170px]"
        label="Rectangle"
      />
      {!matchedShapes.window && (
        <div className="absolute top-10 left-[170px] w-[120px] h-[75px] flex items-center justify-center pointer-events-none bg-black/10 rounded-xl border-4 border-dashed border-sky-400">
          {renderShape("rectangle", "#d1d5db", 110)}
        </div>
      )}
      {matchedShapes.window && (
        <div className="absolute top-10 left-[170px] w-[120px] h-[75px] flex items-center justify-center rounded-xl animate-[scale-in_0.3s_ease-out] shadow-inner" style={{ backgroundColor: shapeColors.rectangle }}>
          {renderShape("rectangle", shapeColors.rectangle, 110)}
        </div>
      )}

      {/* Back Windows */}
      <div className="absolute top-10 right-12 w-[85px] h-[75px] bg-sky-300 rounded-xl border-4 border-gray-700 shadow-inner" />
      <div className="absolute top-[110px] right-12 w-[85px] h-[75px] bg-sky-300 rounded-xl border-4 border-gray-700 shadow-inner" />

      {/* Door */}
      <div className="absolute bottom-6 left-[315px] w-20 h-[120px] bg-gradient-to-b from-red-500 to-red-600 rounded-t-2xl border-4 border-red-700 shadow-lg" />
      <div className="absolute bottom-[80px] left-[320px] w-4 h-4 bg-gray-800 rounded-full shadow-inner" />
      <div className="absolute bottom-[65px] left-[325px] w-8 h-1 bg-red-800" />

      {/* Triangle Drop Zone */}
      <DropZone
        expectedShape="triangle"
        onDrop={(shape) => handleShapeDrop("triangle", "triangle", shape)}
        isMatched={matchedShapes.triangle}
        className="w-[70px] h-[60px] top-[120px] -left-[75px]"
        label="Triangle"
      />
      {!matchedShapes.triangle && (
        <div className="absolute top-[120px] -left-[75px] w-[70px] h-[60px] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-red-400 rounded-lg bg-black/10">
            {renderShape("triangle", "#d1d5db", 65)}
          </div>
        </div>
      )}
      {matchedShapes.triangle && (
        <div className="absolute top-[120px] -left-[75px] flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
          {renderShape("triangle", shapeColors.triangle, 65)}
        </div>
      )}

      {/* Wheels */}
      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel1", "circle", shape)}
        isMatched={matchedShapes.wheel1}
        className="w-24 h-24 rounded-full -bottom-12 left-[75px]"
        label="Circle"
      />
      {!matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[75px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[75px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel2", "circle", shape)}
        isMatched={matchedShapes.wheel2}
        className="w-24 h-24 rounded-full -bottom-12 right-[165px]"
        label="Circle"
      />
      {!matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[165px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[165px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      {/* Headlights */}
      <div className="absolute bottom-10 left-1 w-8 h-6 bg-yellow-200 rounded-full border-2 border-yellow-600 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
      <div className="absolute top-[120px] left-1 w-8 h-6 bg-red-400 rounded-full border-2 border-red-700 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
      
      {/* Stop Sign */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-12 w-10 h-16 bg-red-600 border-2 border-white shadow-lg">
        <p className="text-white font-fredoka font-bold text-xs text-center mt-5 rotate-90">STOP</p>
      </div>
    </div>
  );
};