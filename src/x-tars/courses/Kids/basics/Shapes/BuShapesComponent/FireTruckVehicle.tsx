import { DropZone } from "./VehicleDropZone";
import { ShapeType } from "@/pages/Index";

interface FireTruckVehicleProps {
  matchedShapes: Record<string, boolean>;
  handleShapeDrop: (zone: string, expectedShape: ShapeType, droppedShape: ShapeType) => void;
  shapeColors: Record<ShapeType, string>;
  renderShape: (type: ShapeType, color: string, size?: number) => JSX.Element;
  isWaving: boolean;
  showBubble: boolean;
}

export const FireTruckVehicle = ({
  matchedShapes,
  handleShapeDrop,
  shapeColors,
  renderShape,
  isWaving,
  showBubble,
}: FireTruckVehicleProps) => {
  return (
    <div className="relative w-[480px] h-[240px] bg-gradient-to-b from-red-500 to-red-600 rounded-[24px] shadow-[0_25px_50px_rgba(0,0,0,0.3)] border-[6px] border-red-800">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute -top-24 left-8 bg-white rounded-2xl px-4 py-3 shadow-lg border-4 border-red-500 animate-[scale-in_0.3s_ease-out] z-50">
          <p className="text-sm font-fredoka font-bold text-gray-800 whitespace-nowrap">
            🔥 Help me find the shapes!
          </p>
          <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white border-r-4 border-b-4 border-red-500 transform rotate-45"></div>
        </div>
      )}
      {/* Fire Truck Cabin */}
      <div className="absolute -top-8 left-8 w-32 h-24 bg-gradient-to-b from-red-500 to-red-600 rounded-t-[20px] border-t-[6px] border-l-[6px] border-r-[6px] border-red-800" />
      
      {/* Fire Truck Label */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-800 px-6 py-1 rounded-full border-4 border-white shadow-lg">
        <p className="text-white font-fredoka font-bold text-sm">FIRE TRUCK</p>
      </div>
      
      {/* Ladder on Top */}
      <div className="absolute -top-16 right-20 w-48 h-8 flex items-center justify-center">
        <div className="w-full h-2 bg-gray-400 rounded-full border-2 border-gray-600">
          <div className="absolute inset-x-0 top-0 flex justify-between px-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1 h-8 bg-gray-500 rounded" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Flame Decal */}
      <div className="absolute top-4 right-4 text-4xl">🔥</div>
      
      {/* Driver Window - Pentagon Drop Zone */}
      <DropZone
        expectedShape="pentagon"
        onDrop={(shape) => handleShapeDrop("driverWindow", "pentagon", shape)}
        isMatched={matchedShapes.driverWindow}
        className="w-[85px] h-[85px] rounded-xl top-2 left-10"
        label="Pentagon"
      />
      {!matchedShapes.driverWindow && (
        <div className="absolute top-2 left-10 w-[85px] h-[85px] flex items-center justify-center pointer-events-none bg-black/10 rounded-xl border-4 border-dashed border-purple-400">
          {renderShape("pentagon", "#d1d5db", 70)}
        </div>
      )}
      {matchedShapes.driverWindow && (
        <div className="absolute top-2 left-10 w-[85px] h-[85px] flex items-center justify-center rounded-xl animate-[scale-in_0.3s_ease-out] shadow-inner" style={{ backgroundColor: shapeColors.pentagon }}>
          {renderShape("pentagon", shapeColors.pentagon, 70)}
          
          {/* Firefighter in window */}
          <div className="absolute top-8 left-2 pointer-events-none z-20">
            <div className="w-6 h-6 bg-orange-800 rounded-full border-2 border-orange-900" />
            <div className="w-8 h-4 bg-yellow-500 rounded-t-lg -ml-1 border-2 border-yellow-600 mt-0.5" />
            <div className={`absolute -right-2 top-1 w-3 h-3 bg-orange-800 rounded-full origin-bottom ${isWaving ? "animate-wave" : ""}`} />
          </div>
        </div>
      )}
      
      {/* Equipment Compartment Window - Rectangle Drop Zone */}
      <DropZone
        expectedShape="rectangle"
        onDrop={(shape) => handleShapeDrop("window", "rectangle", shape)}
        isMatched={matchedShapes.window}
        className="w-[120px] h-[75px] rounded-lg top-20 left-[200px]"
        label="Rectangle"
      />
      {!matchedShapes.window && (
        <div className="absolute top-20 left-[200px] w-[120px] h-[75px] flex items-center justify-center pointer-events-none bg-black/10 rounded-lg border-4 border-dashed border-sky-400">
          {renderShape("rectangle", "#d1d5db", 110)}
        </div>
      )}
      {matchedShapes.window && (
        <div className="absolute top-20 left-[200px] w-[120px] h-[75px] flex items-center justify-center rounded-lg animate-[scale-in_0.3s_ease-out] shadow-inner bg-yellow-400 border-4 border-yellow-600">
          {renderShape("rectangle", shapeColors.rectangle, 110)}
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🧯</div>
        </div>
      )}

      {/* Hose Compartments */}
      <div className="absolute bottom-8 left-[160px] w-[120px] h-[80px] bg-red-700 rounded-lg border-4 border-red-900 shadow-inner">
        <div className="absolute inset-2 flex gap-1">
          <div className="flex-1 bg-gray-600 rounded"></div>
          <div className="flex-1 bg-gray-600 rounded"></div>
          <div className="flex-1 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Hexagon Drop Zone - Warning Sign */}
      <DropZone
        expectedShape="hexagon"
        onDrop={(shape) => handleShapeDrop("hexagon", "hexagon", shape)}
        isMatched={matchedShapes.hexagon}
        className="w-[70px] h-[70px] top-[100px] left-8"
        label="Hexagon"
      />
      {!matchedShapes.hexagon && (
        <div className="absolute top-[100px] left-8 w-[70px] h-[70px] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-amber-400 rounded-lg bg-black/10">
            {renderShape("hexagon", "#d1d5db", 65)}
          </div>
        </div>
      )}
      {matchedShapes.hexagon && (
        <div className="absolute top-[100px] left-8 flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
          {renderShape("hexagon", shapeColors.hexagon, 65)}
        </div>
      )}

      {/* Wheels */}
      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel1", "circle", shape)}
        isMatched={matchedShapes.wheel1}
        className="w-24 h-24 rounded-full -bottom-12 left-[50px]"
        label="Circle"
      />
      {!matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[50px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[50px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel2", "circle", shape)}
        isMatched={matchedShapes.wheel2}
        className="w-24 h-24 rounded-full -bottom-12 right-[100px]"
        label="Circle"
      />
      {!matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[100px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[100px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      {/* Front Lights */}
      <div className="absolute bottom-4 -left-2 w-6 h-8 bg-yellow-200 rounded-full border-2 border-yellow-600 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
      <div className="absolute top-[100px] -left-2 w-6 h-8 bg-red-400 rounded-full border-2 border-red-700 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
    </div>
  );
};