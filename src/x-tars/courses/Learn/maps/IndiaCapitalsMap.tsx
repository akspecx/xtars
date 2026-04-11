import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

// Standard India States and Capitals mapping
const stateCapitals: Record<string, string> = {
  "Andhra Pradesh": "Amaravati",
  "Arunachal Pradesh": "Itanagar",
  "Assam": "Dispur",
  "Bihar": "Patna",
  "Chhattisgarh": "Raipur",
  "Goa": "Panaji",
  "Gujarat": "Gandhinagar",
  "Haryana": "Chandigarh",
  "Himachal Pradesh": "Shimla",
  "Jharkhand": "Ranchi",
  "Karnataka": "Bengaluru",
  "Kerala": "Thiruvananthapuram",
  "Madhya Pradesh": "Bhopal",
  "Maharashtra": "Mumbai",
  "Manipur": "Imphal",
  "Meghalaya": "Shillong",
  "Mizoram": "Aizawl",
  "Nagaland": "Kohima",
  "Odisha": "Bhubaneswar",
  "Punjab": "Chandigarh",
  "Rajasthan": "Jaipur",
  "Sikkim": "Gangtok",
  "Tamil Nadu": "Chennai",
  "Telangana": "Hyderabad",
  "Tripura": "Agartala",
  "Uttar Pradesh": "Lucknow",
  "Uttarakhand": "Dehradun",
  "West Bengal": "Kolkata"
};

export default function IndiaCapitalsMap() {
  const navigate = useNavigate();
  const [statesData, setStatesData] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");

  useEffect(() => {
    fetch("/india_states.geojson")
      .then((res) => res.json())
      .then((data) => {
        setStatesData(data);
        // Identify which states map to our DB
        const featureNames = data.features.map((f: any) => f.properties.st_nm || f.properties.ST_NM || f.properties.name);
        
        let availableQuestions = Object.keys(stateCapitals).filter(st => {
           // Basic comparison including case sensitivity fallbacks
           return featureNames.some((f: string) => 
               f && f.toLowerCase().replace("&", "and") === st.toLowerCase()
           );
        });

        if (availableQuestions.length === 0) {
           // Fallback in case geojson names are totally different: just use known list
           availableQuestions = Object.keys(stateCapitals);
        }
        
        // Shuffle questions
        for (let i = availableQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableQuestions[i], availableQuestions[j]] = [availableQuestions[j], availableQuestions[i]];
        }
        setQuestions(availableQuestions);
      })
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  const currentTargetState = questions[currentQuestionIndex];
  const currentCapital = currentTargetState ? stateCapitals[currentTargetState] : "";

  const handleStateClick = (rawStateName: string) => {
    if (feedback === "correct" || !currentTargetState) return;
    if (!rawStateName) return;

    // Normalizing names for comparison
    const normClicked = rawStateName.toLowerCase().replace("&", "and").trim();
    const normTarget = currentTargetState.toLowerCase().replace("&", "and").trim();

    const isCorrect = normClicked === normTarget;

    setSelectedState(rawStateName);
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setTimeout(() => {
        setFeedback("none");
        setSelectedState(null);
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setFeedback("none");
        setSelectedState(null);
      }, 1500);
    }
  };

  const onEachState = (state: any, layer: any) => {
    const rawName = state.properties.st_nm || state.properties.ST_NM || state.properties.name;
    layer.on({
      click: () => handleStateClick(rawName),
    });
  };

  const getStateStyle = (state: any) => {
    const rawName = state.properties.st_nm || state.properties.ST_NM || state.properties.name;
    const isSelected = selectedState === rawName;

    if (isSelected) {
      if (feedback === "correct") {
        return { fillColor: "#22c55e", color: "#166534", weight: 3, fillOpacity: 0.9, dashArray: "5, 5" }; // green
      }
      if (feedback === "incorrect") {
        return { fillColor: "#ef4444", color: "#991b1b", weight: 3, fillOpacity: 0.9, dashArray: "5, 5" }; // red
      }
    }

    return {
      fillColor: "#e0e7ff",
      color: "#6366f1",
      weight: 1.5,
      dashArray: "4, 4",
      fillOpacity: 0.6,
    };
  };

  if (currentQuestionIndex >= questions.length && questions.length > 0) {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#fdfbf7] min-h-screen">
          <h2 className="text-4xl sm:text-5xl font-black text-emerald-600 mb-6 tracking-tight">🎉 Mission Complete!</h2>
          <p className="text-lg sm:text-xl font-bold text-gray-700 text-center max-w-lg mb-8">
             You have successfully mastered the capitals of all Indian states! The world is yours to map.
          </p>
          <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase hover:bg-indigo-700 shadow-[0_6px_0_#4338ca] active:translate-y-1 active:shadow-none transition-all">
             Back to Maps
          </button>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-[#fdfbf7] p-2 sm:p-6 min-h-screen relative shadow-inner overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_70%)] blur-2xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6 text-[#3e2723] pt-4 z-10 px-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#3e2723] shadow-[0_4px_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all border-2 border-gray-100"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>
          
          <div className="text-center flex-1 bg-white mx-4 py-4 px-6 rounded-[2rem] shadow-xl border-4 border-indigo-50 relative overflow-hidden">
             <div className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl sm:text-4xl opacity-20 pointer-events-none">📍</div>
             <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-indigo-400 mb-1">Geographical Mission</p>
             <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-800 tracking-tight leading-tight">
               Which state's capital is <span className="text-emerald-600 underline decoration-4 underline-offset-4 decoration-emerald-200">{currentCapital || "..."}</span>?
             </h2>
          </div>

          <div className="min-w-[4rem] h-12 bg-indigo-600 rounded-2xl flex items-center justify-center px-4 text-white shadow-[0_4px_0_#4338ca] font-black tracking-wide text-lg border-2 border-indigo-400">
             {currentQuestionIndex + 1}<span className="opacity-60 text-sm mx-0.5">/</span>{questions.length}
          </div>
      </div>

      <div className="w-full max-w-5xl flex-1 rounded-[2.5rem] overflow-hidden mb-6 shadow-[0_12px_40px_rgba(79,70,229,0.15)] border-[6px] border-white z-0 bg-[#f8fafc] relative">
        {!statesData && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/90 backdrop-blur-sm">
                <div className="text-2xl font-black text-indigo-400 animate-pulse tracking-widest uppercase">Fetching Atlas...</div>
            </div>
        )}
        {/* @ts-ignore */}
        <MapContainer
          center={[22.5, 79.5]}
          zoom={4.8}
          className="h-full w-full outline-none"
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={true}
        >
          {/* Base Tile Layer */}
          {/* @ts-ignore */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />
          {statesData && (
            // @ts-ignore
            <GeoJSON
              key={`${currentQuestionIndex}-${selectedState}-${feedback}`} // Forces re-render of styles immediately
              data={statesData}
              style={getStateStyle}
              onEachFeature={onEachState}
            />
          )}
        </MapContainer>
      </div>
      
      {/* Floating Feedback Notifications */}
      {feedback === "correct" && (
         <div className="fixed bottom-12 bg-emerald-500 text-white font-black text-xl sm:text-2xl px-10 py-5 rounded-[2rem] shadow-[0_8px_30px_rgba(16,185,129,0.4)] border-4 border-white animate-bounce z-50 flex items-center gap-3">
            <span className="text-3xl bg-white/20 rounded-full p-1">✅</span> Magnificent! It's {currentTargetState}!
         </div>
      )}

      {feedback === "incorrect" && (
         <div className="fixed bottom-12 bg-rose-500 text-white font-black text-xl sm:text-2xl px-10 py-5 rounded-[2rem] shadow-[0_8px_30px_rgba(225,29,72,0.4)] border-4 border-white animate-shake z-50 flex items-center gap-3">
            <span className="text-3xl bg-white/20 rounded-full p-1">❌</span> Oops! Keep looking down the map!
         </div>
      )}

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.3s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}
