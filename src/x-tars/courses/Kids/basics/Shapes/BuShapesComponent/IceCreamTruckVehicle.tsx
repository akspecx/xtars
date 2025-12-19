// import { DropZone } from "./VehicleDropZone";
// import { ShapeType } from "@/pages/Index";

// interface IceCreamTruckVehicleProps {
//   matchedShapes: Record<string, boolean>;
//   handleShapeDrop: (zone: string, expectedShape: ShapeType, droppedShape: ShapeType) => void;
//   shapeColors: Record<ShapeType, string>;
//   renderShape: (type: ShapeType, color: string, size?: number) => JSX.Element;
//   isWaving: boolean;
// }

// export const IceCreamTruckVehicle = ({
//   matchedShapes,
//   handleShapeDrop,
//   shapeColors,
//   renderShape,
//   isWaving,
// }: IceCreamTruckVehicleProps) => {
//   return (
//     <div className="relative w-[480px] h-[240px] bg-gradient-to-b from-pink-400 to-pink-500 rounded-[24px] shadow-[0_25px_50px_rgba(0,0,0,0.3)] border-[6px] border-pink-700">
//       {/* Ice Cream Truck Cabin */}
//       <div className="absolute -top-8 left-8 w-32 h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-t-[20px] border-t-[6px] border-l-[6px] border-r-[6px] border-pink-700" />
      
//       {/* Ice Cream Label */}
//       <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-700 px-6 py-1 rounded-full border-4 border-white shadow-lg">
//         <p className="text-white font-fredoka font-bold text-sm">ICE CREAM</p>
//       </div>
      
//       {/* Giant Ice Cream Cone on Top */}
//       <div className="absolute -top-20 right-20 flex flex-col items-center">
//         <div className="text-6xl">🍦</div>
//       </div>
      
//       {/* Sprinkle Decorations */}
//       <div className="absolute top-4 left-[140px] text-2xl">🍬</div>
//       <div className="absolute top-12 right-8 text-2xl">🍭</div>
//       <div className="absolute bottom-16 left-[50px] text-2xl">🎂</div>
      
//       {/* Driver Window - Pentagon Drop Zone */}
//       <DropZone
//         expectedShape="pentagon"
//         onDrop={(shape) => handleShapeDrop("driverWindow", "pentagon", shape)}
//         isMatched={matchedShapes.driverWindow}
//         className="w-[85px] h-[85px] rounded-xl top-2 left-10"
//         label="Pentagon"
//       />
//       {!matchedShapes.driverWindow && (
//         <div className="absolute top-2 left-10 w-[85px] h-[85px] flex items-center justify-center pointer-events-none bg-black/10 rounded-xl border-4 border-dashed border-purple-400">
//           {renderShape("pentagon", "#d1d5db", 70)}
//         </div>
//       )}
//       {matchedShapes.driverWindow && (
//         <div className="absolute top-2 left-10 w-[85px] h-[85px] flex items-center justify-center rounded-xl animate-[scale-in_0.3s_ease-out] shadow-inner" style={{ backgroundColor: shapeColors.pentagon }}>
//           {renderShape("pentagon", shapeColors.pentagon, 70)}
          
//           {/* Ice cream vendor in window */}
//           <div className="absolute top-8 left-2 pointer-events-none z-20">
//             <div className="w-6 h-6 bg-orange-800 rounded-full border-2 border-orange-900">
//               {/* Hat */}
//               <div className="absolute -top-2 -left-1 w-8 h-3 bg-white rounded-t-full border-2 border-pink-600" />
//             </div>
//             <div className="w-8 h-4 bg-white rounded-t-lg -ml-1 border-2 border-gray-300 mt-0.5" />
//             <div className={`absolute -right-2 top-1 w-3 h-3 bg-orange-800 rounded-full origin-bottom ${isWaving ? "animate-wave" : ""}`} />
//           </div>
//         </div>
//       )}
      
//       {/* Serving Window - Rectangle Drop Zone */}
//       <DropZone
//         expectedShape="rectangle"
//         onDrop={(shape) => handleShapeDrop("window", "rectangle", shape)}
//         isMatched={matchedShapes.window}
//         className="w-[120px] h-[85px] rounded-xl top-16 left-[180px]"
//         label="Rectangle"
//       />
//       {!matchedShapes.window && (
//         <div className="absolute top-16 left-[180px] w-[120px] h-[85px] flex items-center justify-center pointer-events-none bg-black/10 rounded-xl border-4 border-dashed border-sky-400">
//           {renderShape("rectangle", "#d1d5db", 110)}
//         </div>
//       )}
//       {matchedShapes.window && (
//         <div className="absolute top-16 left-[180px] w-[120px] h-[85px] flex items-center justify-center rounded-xl animate-[scale-in_0.3s_ease-out] shadow-inner bg-white border-4 border-pink-600">
//           {renderShape("rectangle", shapeColors.rectangle, 110)}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-3xl">🍨</div>
//               <div className="text-xs font-bold text-pink-700">OPEN</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Menu Board */}
//       <div className="absolute top-20 right-12 w-24 h-32 bg-white rounded-lg border-4 border-pink-600 shadow-lg p-2">
//         <div className="text-xs font-bold text-pink-700 text-center mb-1">MENU</div>
//         <div className="space-y-1 text-[10px]">
//           <div>🍦 Cone</div>
//           <div>🍨 Cup</div>
//           <div>🍧 Sundae</div>
//           <div>🥤 Float</div>
//         </div>
//       </div>

//       {/* Triangle Drop Zone - Warning Cone */}
//       <DropZone
//         expectedShape="triangle"
//         onDrop={(shape) => handleShapeDrop("triangle", "triangle", shape)}
//         isMatched={matchedShapes.triangle}
//         className="w-[70px] h-[60px] top-[110px] -left-[75px]"
//         label="Triangle"
//       />
//       {!matchedShapes.triangle && (
//         <div className="absolute top-[110px] -left-[75px] w-[70px] h-[60px] flex items-center justify-center pointer-events-none">
//           <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-red-400 rounded-lg bg-black/10">
//             {renderShape("triangle", "#d1d5db", 65)}
//           </div>
//         </div>
//       )}
//       {matchedShapes.triangle && (
//         <div className="absolute top-[110px] -left-[75px] flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
//           {renderShape("triangle", shapeColors.triangle, 65)}
//         </div>
//       )}

//       {/* Wheels */}
//       <DropZone
//         expectedShape="circle"
//         onDrop={(shape) => handleShapeDrop("wheel1", "circle", shape)}
//         isMatched={matchedShapes.wheel1}
//         className="w-24 h-24 rounded-full -bottom-12 left-[60px]"
//         label="Circle"
//       />
//       {!matchedShapes.wheel1 && (
//         <div className="absolute -bottom-12 left-[60px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
//           {renderShape("circle", "#d1d5db", 90)}
//         </div>
//       )}
//       {matchedShapes.wheel1 && (
//         <div className="absolute -bottom-12 left-[60px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
//           <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
//           <div className="absolute inset-8 bg-gray-400 rounded-full" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
//         </div>
//       )}

//       <DropZone
//         expectedShape="circle"
//         onDrop={(shape) => handleShapeDrop("wheel2", "circle", shape)}
//         isMatched={matchedShapes.wheel2}
//         className="w-24 h-24 rounded-full -bottom-12 right-[110px]"
//         label="Circle"
//       />
//       {!matchedShapes.wheel2 && (
//         <div className="absolute -bottom-12 right-[110px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
//           {renderShape("circle", "#d1d5db", 90)}
//         </div>
//       )}
//       {matchedShapes.wheel2 && (
//         <div className="absolute -bottom-12 right-[110px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
//           <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
//           <div className="absolute inset-8 bg-gray-400 rounded-full" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
//         </div>
//       )}

//       {/* Headlights */}
//       <div className="absolute bottom-10 -left-2 w-6 h-8 bg-yellow-200 rounded-full border-2 border-yellow-600 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
//       <div className="absolute top-[100px] -left-2 w-6 h-8 bg-orange-400 rounded-full border-2 border-orange-600 shadow-[0_0_20px_rgba(251,146,60,0.5)]" />
      
//       {/* Price Sign */}
//       <div className="absolute bottom-4 right-4 bg-yellow-300 px-3 py-2 rounded-full border-3 border-yellow-600 font-bold text-pink-700 shadow-lg rotate-12">
//         $2
//       </div>
//     </div>
//   );
// };
import { DropZone } from "./VehicleDropZone";
import { ShapeType } from "@/pages/Index";

interface IceCreamTruckVehicleProps {
  matchedShapes: Record<string, boolean>;
  handleShapeDrop: (zone: string, expectedShape: ShapeType, droppedShape: ShapeType) => void;
  shapeColors: Record<ShapeType, string>;
  renderShape: (type: ShapeType, color: string, size?: number) => JSX.Element;
  isWaving: boolean;
  showBubble: boolean;
}

export const IceCreamTruckVehicle = ({
  matchedShapes,
  handleShapeDrop,
  shapeColors,
  renderShape,
  isWaving,
  showBubble,
}: IceCreamTruckVehicleProps) => {
  return (
    <div className="relative w-[480px] h-[240px] bg-gradient-to-b from-pink-400 to-pink-500 rounded-[24px] shadow-[0_25px_50px_rgba(0,0,0,0.3)] border-[6px] border-pink-700">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute -top-24 left-8 bg-white rounded-2xl px-4 py-3 shadow-lg border-4 border-pink-500 animate-[scale-in_0.3s_ease-out] z-50">
          <p className="text-sm font-fredoka font-bold text-gray-800 whitespace-nowrap">
            🍦 Drag shapes to the right spots!
          </p>
          <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white border-r-4 border-b-4 border-pink-500 transform rotate-45"></div>
        </div>
      )}
      {/* Ice Cream Truck Cabin */}
      <div className="absolute -top-8 left-8 w-32 h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-t-[20px] border-t-[6px] border-l-[6px] border-r-[6px] border-pink-700" />
      
      {/* Ice Cream Label */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-700 px-6 py-1 rounded-full border-4 border-white shadow-lg">
        <p className="text-white font-fredoka font-bold text-sm">ICE CREAM</p>
      </div>
      
      {/* Giant Ice Cream Cone on Top */}
      <div className="absolute -top-20 right-20 flex flex-col items-center">
        <div className="text-6xl">🍦</div>
      </div>
      
      {/* Sprinkle Decorations */}
      <div className="absolute top-4 left-[140px] text-2xl">🍬</div>
      <div className="absolute top-12 right-8 text-2xl">🍭</div>
      <div className="absolute bottom-16 left-[50px] text-2xl">🎂</div>
      
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
          
          {/* Ice cream vendor in window */}
          <div className="absolute top-8 left-2 pointer-events-none z-20">
            <div className="w-6 h-6 bg-orange-800 rounded-full border-2 border-orange-900">
              {/* Hat */}
              <div className="absolute -top-2 -left-1 w-8 h-3 bg-white rounded-t-full border-2 border-pink-600" />
            </div>
            <div className="w-8 h-4 bg-white rounded-t-lg -ml-1 border-2 border-gray-300 mt-0.5" />
            <div className={`absolute -right-2 top-1 w-3 h-3 bg-orange-800 rounded-full origin-bottom ${isWaving ? "animate-wave" : ""}`} />
          </div>
        </div>
      )}
      
      {/* Serving Window - Rectangle Drop Zone */}
      <DropZone
        expectedShape="rectangle"
        onDrop={(shape) => handleShapeDrop("window", "rectangle", shape)}
        isMatched={matchedShapes.window}
        className="w-[120px] h-[85px] rounded-xl top-16 left-[180px]"
        label="Rectangle"
      />
      {!matchedShapes.window && (
        <div className="absolute top-16 left-[180px] w-[120px] h-[85px] flex items-center justify-center pointer-events-none bg-black/10 rounded-xl border-4 border-dashed border-sky-400">
          {renderShape("rectangle", "#d1d5db", 110)}
        </div>
      )}
      {matchedShapes.window && (
        <div className="absolute top-16 left-[180px] w-[120px] h-[85px] flex items-center justify-center rounded-xl animate-[scale-in_0.3s_ease-out] shadow-inner bg-white border-4 border-pink-600">
          {renderShape("rectangle", shapeColors.rectangle, 110)}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl">🍨</div>
              <div className="text-xs font-bold text-pink-700">OPEN</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Board */}
      <div className="absolute top-20 right-12 w-24 h-32 bg-white rounded-lg border-4 border-pink-600 shadow-lg p-2">
        <div className="text-xs font-bold text-pink-700 text-center mb-1">MENU</div>
        <div className="space-y-1 text-[10px]">
          <div>🍦 Cone</div>
          <div>🍨 Cup</div>
          <div>🍧 Sundae</div>
          <div>🥤 Float</div>
        </div>
      </div>

      {/* Cloud Drop Zone - Sweet Dream Cloud */}
      <DropZone
        expectedShape="cloud"
        onDrop={(shape) => handleShapeDrop("cloud", "cloud", shape)}
        isMatched={matchedShapes.cloud}
        className="w-[80px] h-[50px] top-[110px] -left-[85px]"
        label="Cloud"
      />
      {!matchedShapes.cloud && (
        <div className="absolute top-[110px] -left-[85px] w-[80px] h-[50px] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-gray-300 rounded-2xl bg-black/10">
            {renderShape("cloud", "#d1d5db", 75)}
          </div>
        </div>
      )}
      {matchedShapes.cloud && (
        <div className="absolute top-[110px] -left-[85px] flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
          {renderShape("cloud", shapeColors.cloud, 75)}
        </div>
      )}

      {/* Wheels */}
      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel1", "circle", shape)}
        isMatched={matchedShapes.wheel1}
        className="w-24 h-24 rounded-full -bottom-12 left-[60px]"
        label="Circle"
      />
      {!matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[60px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel1 && (
        <div className="absolute -bottom-12 left-[60px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      <DropZone
        expectedShape="circle"
        onDrop={(shape) => handleShapeDrop("wheel2", "circle", shape)}
        isMatched={matchedShapes.wheel2}
        className="w-24 h-24 rounded-full -bottom-12 right-[110px]"
        label="Circle"
      />
      {!matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[110px] w-24 h-24 rounded-full flex items-center justify-center pointer-events-none border-4 border-dashed border-gray-600 bg-black/10">
          {renderShape("circle", "#d1d5db", 90)}
        </div>
      )}
      {matchedShapes.wheel2 && (
        <div className="absolute -bottom-12 right-[110px] w-24 h-24 rounded-full border-[6px] border-gray-800 animate-[scale-in_0.3s_ease-out] shadow-[0_8px_20px_rgba(0,0,0,0.4)]" style={{ backgroundColor: shapeColors.circle }}>
          <div className="absolute inset-4 bg-gray-500 rounded-full shadow-inner" />
          <div className="absolute inset-8 bg-gray-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full" />
        </div>
      )}

      {/* Headlights */}
      <div className="absolute bottom-10 -left-2 w-6 h-8 bg-yellow-200 rounded-full border-2 border-yellow-600 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
      <div className="absolute top-[100px] -left-2 w-6 h-8 bg-orange-400 rounded-full border-2 border-orange-600 shadow-[0_0_20px_rgba(251,146,60,0.5)]" />
      
      {/* Price Sign */}
      <div className="absolute bottom-4 right-4 bg-yellow-300 px-3 py-2 rounded-full border-3 border-yellow-600 font-bold text-pink-700 shadow-lg rotate-12">
        $2
      </div>
    </div>
  );
};