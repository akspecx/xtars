import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

/* ===========================
   Props definition (separate)
=========================== */
interface NumberGameCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  onClick: () => void;
}

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
const NumberGameCard = memo<NumberGameCardProps>((props) => {
  const { title, subtitle, icon, gradient, onClick } = props;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -8, scale: 1.01 }}
      onClick={onClick}
      aria-label={`Open ${title}`}
      className="flex flex-col bg-[#faf9f6] rounded-[2rem] border border-[#c4a484]/30 shadow-[5px_5px_0px_#a88a6d] hover:shadow-[8px_8px_0px_#a88a6d] transition-all cursor-pointer group overflow-hidden h-full min-h-[260px] max-w-[280px] mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
    >
      {/* Header */}
      <div className="relative h-28 bg-[#3e2723] flex items-center justify-center overflow-hidden">
        <NumericBackground />

        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 mix-blend-overlay`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3e2723] via-transparent to-black/10 z-10" />

        {/* Ghost Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-1000 blur-[2px]">
          <span className="text-[80px] select-none scale-110 transform group-hover:scale-100 transition-transform duration-1000">
            {String(icon)}
          </span>
        </div>

        {/* Main Icon */}
        <div className="relative z-20 transform group-hover:rotate-12 transition-transform duration-500">
          <span className="text-6xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
            {String(icon)}
          </span>
        </div>

        {/* Top rim */}
        <div
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-80`}
        />
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 relative z-10 bg-[#faf9f6] shadow-[inset_0_4px_10px_rgba(0,0,0,0.02)]">
        <h4 className="text-base sm:text-lg font-bold text-[#3e2723] tracking-[0.03em] mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
          {String(title)}
        </h4>
        <p className="text-xs sm:text-sm font-normal text-[#5C4033] opacity-85 mb-3 leading-relaxed">
          {String(subtitle)}
        </p>

        <div className="mt-auto flex items-center gap-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 font-bold text-[10px] tracking-[0.05em]">
          <span>Play session</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.button>
  );
});

/* ===========================
   Exports
=========================== */
export { NUMBER_GAME_CARD_PROPS };
export default NumberGameCard;
