// // import React, { useEffect, useState } from "react";
// // import { MapContainer, GeoJSON } from "react-leaflet";
// // import "leaflet/dist/leaflet.css";


// // type StateFeature = {
// //   type: string;
// //   properties: {
// //     ST_NM: string;
// //   };
// //   geometry: any;
// // };

// // const IndiaMaps: React.FC = () => {
// //   const [geoData, setGeoData] = useState<any>(null);
// //   const [selectedStates, setSelectedStates] = useState<string[]>([]);
// //   const [checked, setChecked] = useState(false);

// //   // ✅ Reliable GeoJSON source
// //   const geoJsonUrl =
// //     "https://raw.githubusercontent.com/datameet/maps/master/States/Admin2/india_states.geojson";

// //   // ✅ Correct answer set for the question
// //   const correctAnswers = [
// //     "Uttarakhand",
// //     "Himachal Pradesh",
// //     "Haryana",
// //     "Delhi",
// //     "Rajasthan",
// //     "Madhya Pradesh",
// //     "Chhattisgarh",
// //     "Jharkhand",
// //     "Bihar",
// //   ];

// // // //   useEffect(() => {
// // // //     fetch(geoJsonUrl)
// // // //       .then((res) => res.json())
// // // //       .then((data) => setGeoData(data))
// // // //       .catch((err) => console.error("Failed to load GeoJSON:", err));
// // // //   }, []);

// // // useEffect(() => {
// // //     setGeoData(indiaGeoData);
// // //   }, []);


// // useEffect(() => {
// //     fetch("/xtars/india_states.geojson")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         setGeoData(data);
// //       })
// //       .catch((err) => console.error("Failed to load GeoJSON:", err));
// //   }, []);

// //   const handleStateClick = (stateName: string) => {
// //     if (checked) return; // disable further clicks after checking
// //     setSelectedStates((prev) =>
// //       prev.includes(stateName)
// //         ? prev.filter((s) => s !== stateName)
// //         : [...prev, stateName]
// //     );
// //   };

// //   const getColor = (stateName: string) => {
// //     if (!checked) {
// //       return selectedStates.includes(stateName) ? "#38BDF8" : "#D1D5DB"; // Tailwind: sky-400 / gray-300
// //     }

// //     if (correctAnswers.includes(stateName) && selectedStates.includes(stateName))
// //       return "#22C55E"; // ✅ green-500
// //     if (!correctAnswers.includes(stateName) && selectedStates.includes(stateName))
// //       return "#EF4444"; // ❌ red-500
// //     if (correctAnswers.includes(stateName) && !selectedStates.includes(stateName))
// //       return "#FACC15"; // 🟡 yellow-400
// //     return "#E5E7EB"; // gray-200
// //   };

// //   const styleState = (feature: any) => ({
// //     fillColor: getColor(feature.properties.ST_NM),
// //     weight: 1,
// //     color: "#1F2937", // gray-800 border
// //     fillOpacity: 0.85,
// //   });

// //   const onEachState = (state: StateFeature, layer: any) => {
// //     const name = state.properties.ST_NM;
// //     layer.on({
// //       click: () => handleStateClick(name),
// //     });
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center p-6 space-y-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg">
// //       <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
// //         🗺️ What are the neighbouring states of{" "}
// //         <span className="text-blue-600">Uttar Pradesh</span>?
// //       </h2>

// //       {geoData ? (
// //         <MapContainer
// //           center={[23.5, 82.5]}
// //           zoom={5}
// //           style={{ height: "500px", width: "95%", borderRadius: "0.75rem" }}
// //           className="overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md"
// //         >
// //           <GeoJSON data={geoData} style={styleState} onEachFeature={onEachState} />
// //         </MapContainer>
// //       ) : (
// //         <p className="text-gray-500 dark:text-gray-300">Loading India map...</p>
// //       )}

// //       <div className="flex space-x-4">
// //         {!checked ? (
// //           <button
// //             onClick={() => setChecked(true)}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
// //           >
// //             Check Answer
// //           </button>
// //         ) : (
// //           <button
// //             onClick={() => {
// //               setChecked(false);
// //               setSelectedStates([]);
// //             }}
// //             className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
// //           >
// //             Retry
// //           </button>
// //         )}
// //       </div>

// //       {checked && (
// //         <div className="text-center text-gray-700 dark:text-gray-300">
// //           <p className="mt-2 font-medium">
// //             ✅ Green = Correct | ❌ Red = Wrong | 🟡 Missed Correct
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default IndiaMaps;

// // src/components/IndiaMap.tsx
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { useEffect, useState } from "react";

// const IndiaMap = () => {
//   const [states, setStates] = useState<any>(null);

//   useEffect(() => {
//     fetch("/india_states.geojson")
//       .then((res) => res.json())
//       .then((data) => setStates(data))
//       .catch((err) => console.error("Failed to load GeoJSON:", err));
//   }, []);

//   return (
//     <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-md">
//       <MapContainer
//         center={[22.9734, 78.6569]}
//         zoom={5}
//         className="h-full w-full z-0"
//         style={{ background: "#e2e2e2" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="© OpenStreetMap contributors"
//         />
//         {states && (
//           <GeoJSON
//             data={states}
//             style={() => ({
//               color: "white",
//               weight: 1,
//               fillColor: "#3b82f6",
//               fillOpacity: 0.5,
//             })}
//           />
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default IndiaMap;


// src/components/IndiaNeighbourQuiz.tsx
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

const correctNeighbours = [
  "Uttarakhand",
  "Himachal Pradesh",
  "Haryana",
  "Delhi",
  "Rajasthan",
  "Madhya Pradesh",
  "Chhattisgarh",
  "Bihar",
  "Jharkhand",
];

export default function IndiaNeighbourQuiz() {
  const [statesData, setStatesData] = useState<any>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/india_states.geojson")
      .then((res) => res.json())
      .then((data) => setStatesData(data))
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  const onEachState = (state: any, layer: any) => {
    const name = state.properties.st_nm;

    layer.on({
      click: () => {
        if (checked) return; // Disable clicks after checking
        setSelectedStates((prev) =>
          prev.includes(name)
            ? prev.filter((n) => n !== name)
            : [...prev, name]
        );
      },
    });
  };

  const getStateStyle = (state: any) => {
    const name = state.properties.st_nm;
    const isSelected = selectedStates.includes(name);

    // If checked, color feedback
    if (checked) {
      if (correctNeighbours.includes(name) && isSelected) {
        return { fillColor: "#16a34a", color: "white", weight: 1, fillOpacity: 0.8 }; // ✅ green
      }
      if (!correctNeighbours.includes(name) && isSelected) {
        return { fillColor: "#dc2626", color: "white", weight: 1, fillOpacity: 0.8 }; // ❌ red
      }
    }

    // Default color
    return {
      fillColor: isSelected ? "#3b82f6" : "#60a5fa",
      color: "white",
      weight: 1,
      fillOpacity: isSelected ? 0.8 : 0.5,
    };
  };

  const handleCheck = () => setChecked(true);

  const handleReset = () => {
    setChecked(false);
    setSelectedStates([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
        🗺️ What are the neighbouring states of{" "}
        <span className="text-blue-600 font-bold">Uttar Pradesh</span>?
      </h2>

      <div className="w-full h-[500px] rounded-lg overflow-hidden mb-4">
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          className="h-full w-full"
          style={{ background: "#e5e7eb" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {statesData && (
            <GeoJSON
              data={statesData}
              style={getStateStyle}
              onEachFeature={onEachState}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCheck}
          disabled={checked}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Check Answer
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow"
        >
          Reset
        </button>
      </div>

      {checked && (
        <div className="mt-4 text-center text-gray-800 dark:text-gray-100">
          ✅ Correct neighbours:{" "}
          <span className="font-semibold text-green-600">
            {correctNeighbours.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}