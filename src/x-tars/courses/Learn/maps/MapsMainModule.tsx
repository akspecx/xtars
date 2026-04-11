import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import NumberGameCard from "../../CommonUtility/CardsUtility";

const MAP_SUB_MODULES = [
   { id: "indiaCapitals", title: "Indian State Capitals", subtitle: "Identify states by their capital", icon: "🇮🇳🗺️", gradient: "from-emerald-500 to-teal-500", path: "/learn/maps/india-capitals"}
];

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0], x: [-10, 10, -10] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_60%)] blur-[40px]"
    />
  </div>
);

export default function MapsMainModule() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none relative shadow-inner min-h-screen">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      <AuroraBackground />

      <div className="w-full max-w-7xl p-6 sm:p-10 relative z-10">
        <motion.div key="hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-10 pb-24">
          
          <div className="bg-[#faf9f6] p-4 md:p-6 lg:p-8 rounded-[3.5rem] border-2 border-[#c4a484]/30 shadow-[8px_8px_0px_#a88a6d,12px_12px_30px_rgba(0,0,0,0.05)] relative overflow-visible group min-h-[180px]">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-center md:text-left max-w-2xl text-[#3e2723]">
                  <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-3 mb-3">
                     <div className="p-2.5 bg-[#3e2723] rounded-2xl text-white shadow-xl"><Target size={20} /></div>
                     <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight break-words">Explore Maps!</h2>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold tracking-tight leading-relaxed opacity-75">
                    Navigate the world and learn geographical locations.
                  </p>
               </div>
               <div className="flex items-center gap-4 shrink-0 bg-[#3e2723] p-5 rounded-[2.5rem] text-white shadow-2xl border-b-8 border-black">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-xl border-2 border-white relative z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="62.8" strokeDashoffset="18.84" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold block mb-1 tracking-[0.05em] opacity-40">Locations</span>
                    <span className="text-4xl font-black tabular-nums">{MAP_SUB_MODULES.length}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 lg:gap-10">
             {MAP_SUB_MODULES.map((game) => (
               <NumberGameCard 
                key={String(game.id)} 
                {...game} 
                onClick={() => navigate(game.path)} 
               />
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
