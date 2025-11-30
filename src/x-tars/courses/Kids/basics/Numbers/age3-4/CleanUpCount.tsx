import React, { useState } from "react";

// Simple clean-up game: drag toys into boxes by type and count them.

type ToyType = "car" | "ball";

interface Toy {
  id: number;
  type: ToyType;
}

const makeToys = (): Toy[] => {
  const toys: Toy[] = [];
  let id = 1;
  const carCount = 2 + Math.floor(Math.random() * 3); // 2–4
  const ballCount = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < carCount; i++) toys.push({ id: id++, type: "car" });
  for (let i = 0; i < ballCount; i++) toys.push({ id: id++, type: "ball" });
  return toys.sort(() => Math.random() - 0.5);
};

const CleanUpCount: React.FC = () => {
  const [floorToys, setFloorToys] = useState<Toy[]>(() => makeToys());
  const [carBox, setCarBox] = useState<Toy[]>([]);
  const [ballBox, setBallBox] = useState<Toy[]>([]);
  const [message, setMessage] = useState<string>("Drag toys into the right box!");

  const reset = () => {
    setFloorToys(makeToys());
    setCarBox([]);
    setBallBox([]);
    setMessage("Drag toys into the right box!");
  };

  const moveToy = (toy: Toy, target: ToyType) => {
    setFloorToys((prev) => prev.filter((t) => t.id !== toy.id));
    if (target === "car") {
      setCarBox((prev) => [...prev, toy]);
    } else {
      setBallBox((prev) => [...prev, toy]);
    }
  };

  const handleDrop = (toyId: number, target: ToyType) => {
    const toy = floorToys.find((t) => t.id === toyId);
    if (!toy) return;
    if (toy.type !== target) {
      setMessage("Oops! That toy belongs in the other box.");
      return;
    }
    moveToy(toy, target);
    setMessage("Great cleaning! Keep going!");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, toy: Toy) => {
    e.dataTransfer.setData("toy-id", toy.id.toString());
  };

  const boxDropHandler = (e: React.DragEvent<HTMLDivElement>, target: ToyType) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData("toy-id");
    const toyId = parseInt(idStr, 10);
    if (!Number.isNaN(toyId)) {
      handleDrop(toyId, target);
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const renderToyIcon = (toy: Toy) => (toy.type === "car" ? "🚗" : "⚽");

  const allClean = floorToys.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-sky-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-700 flex items-center gap-2">
              <span>🧸 Clean-Up Count</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Drag the cars into the car box and the balls into the ball box.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Mess
          </button>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">
          {allClean ? "All tidy! Great job! 🎉" : message}
        </p>

        {/* Floor toys */}
        <div className="mb-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span>Floor</span>
            <span className="text-xs text-gray-500">(drag from here)</span>
          </h2>
          <div className="min-h-[60px] rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2 flex flex-wrap gap-2">
            {floorToys.map((toy) => (
              <div
                key={toy.id}
                draggable
                onDragStart={(e) => handleDragStart(e, toy)}
                className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center text-2xl cursor-grab active:scale-95 transition-transform"
              >
                {renderToyIcon(toy)}
              </div>
            ))}
            {floorToys.length === 0 && (
              <span className="text-xs sm:text-sm text-gray-400 self-center">No toys on the floor!</span>
            )}
          </div>
        </div>

        {/* Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onDragOver={allowDrop}
            onDrop={(e) => boxDropHandler(e, "car")}
            className="rounded-3xl border-2 border-teal-300 bg-gradient-to-br from-white to-teal-50 shadow-inner p-4 flex flex-col gap-2 min-h-[120px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-teal-700 flex items-center gap-2">
                <span>🚗 Car Box</span>
              </span>
              <span className="text-xs sm:text-sm text-teal-700 font-semibold">
                Count: {carBox.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {carBox.map((toy) => (
                <div
                  key={toy.id}
                  className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center text-xl"
                >
                  {renderToyIcon(toy)}
                </div>
              ))}
            </div>
          </div>

          <div
            onDragOver={allowDrop}
            onDrop={(e) => boxDropHandler(e, "ball")}
            className="rounded-3xl border-2 border-indigo-300 bg-gradient-to-br from-white to-indigo-50 shadow-inner p-4 flex flex-col gap-2 min-h-[120px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-indigo-700 flex items-center gap-2">
                <span>⚽ Ball Box</span>
              </span>
              <span className="text-xs sm:text-sm text-indigo-700 font-semibold">
                Count: {ballBox.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ballBox.map((toy) => (
                <div
                  key={toy.id}
                  className="w-10 h-10 rounded-2xl bg-white shadow flex items-center justify-center text-xl"
                >
                  {renderToyIcon(toy)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanUpCount;


