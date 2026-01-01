import React, { memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

/* ===========================
   Props definition (separate)
=========================== */
const NUMBER_GAME_CARD_PROPS = [
  "id",
  "title",
  "subtitle",
  "icon",
  "gradient",
  "onClick",
];

/* ===========================
   Internal background component
   (kept in same file, no import)
=========================== */
const NumericBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
    {["1", "0", "7", "3", "5"].map((num, i) => (
      <motion.span
        key={i}
        className="absolute text-3xl font-black text-white"
        initial={{ y: "110%", x: `${i * 25}%`, opacity: 0 }}
        animate={{ y: "-10%", opacity: [0, 1, 0] }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: "linear",
          delay: i * 0.8,
        }}
      >
        {String(num)}
      </motion.span>
    ))}
  </div>
);

/* ===========================
   Main Card Component
=========================== */
const NumberGameCard = memo((props) => {
  const { id, title, subtitle, icon, gradient, onClick } = props;

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className="flex flex-col bg-[#faf9f6] rounded-[2.5rem] border border-[#c4a484]/30 shadow-[6px_6px_0px_#a88a6d] hover:shadow-[10px_10px_0px_#a88a6d] transition-all cursor-pointer group overflow-hidden h-full min-h-[360px]"
    >
      {/* Header */}
      <div className="relative h-44 bg-[#3e2723] flex items-center justify-center overflow-hidden">
        <NumericBackground />

        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 mix-blend-overlay`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3e2723] via-transparent to-black/10 z-10" />

        {/* Ghost Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-1000 blur-[2px]">
          <span className="text-[160px] select-none scale-125 transform group-hover:scale-100 transition-transform duration-1000">
            {String(icon)}
          </span>
        </div>

        {/* Main Icon */}
        <div className="relative z-20 transform group-hover:rotate-12 transition-transform duration-500">
          <span className="text-7xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
            {String(icon)}
          </span>
        </div>

        {/* Top rim */}
        <div
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-80`}
        />
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col flex-1 relative z-10 bg-[#faf9f6] shadow-[inset_0_4px_10px_rgba(0,0,0,0.02)]">
        <h4 className="text-xl font-black text-[#3e2723] uppercase tracking-tighter mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {String(title)}
        </h4>
        <p className="text-[12px] font-bold text-[#8d6e63] uppercase opacity-60 tracking-widest mb-4 leading-relaxed italic">
          {String(subtitle)}
        </p>

        <div className="mt-auto flex items-center gap-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 font-black uppercase text-[10px] tracking-widest">
          <span>Play Session</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
});

/* ===========================
   Exports
=========================== */
export { NUMBER_GAME_CARD_PROPS };
export default NumberGameCard;
