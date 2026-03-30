import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  Puzzle, 
  Brain, 
  Star, 
  Play, 
  Trophy,
  Rocket,
  Sparkles
} from 'lucide-react';
import { useMode } from '../../context/ModeContext';

const SubjectCard = ({ title, icon: Icon, path, color, progress, lessons }: any) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="group relative bg-white rounded-[3rem] border-4 border-amber-100 shadow-xl overflow-hidden cursor-pointer"
    >
      <div className={`p-8 ${color} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }} />
        <div className="relative z-10 flex justify-between items-start">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center text-white border-2 border-white/30 shadow-2xl">
            <Icon size={40} />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-white/20"
          >
            <Sparkles size={60} />
          </motion.div>
        </div>
        <div className="mt-6 relative z-10">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{title}</h3>
          <p className="text-white/60 font-bold text-xs uppercase tracking-widest">{lessons} Modules Available</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black text-amber-900/40 uppercase tracking-widest">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 bg-amber-50 rounded-full overflow-hidden border-2 border-amber-100/50 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full ${color}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {progress === 100 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full border-2 border-emerald-200">
                <Star size={14} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-wider">Done!</span>
              </div>
            ) : progress > 0 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-600 rounded-full border-2 border-amber-200">
                <span className="animate-spin text-xs">🔄</span>
                <span className="text-[10px] font-black uppercase tracking-wider">Playing</span>
              </div>
            ) : null}
          </div>
          <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const KidsHub: React.FC = () => {
  const { childProfile } = useMode();

  const kidsZoneModules = [
    { title: "Visual Logic", icon: Puzzle, path: "/games/visuallogic", color: "bg-indigo-500", progress: 45, lessons: 17 },
    { title: "Numbers & Counting", icon: Brain, path: "/games/numbers", color: "bg-emerald-500", progress: 30, lessons: 24 },
    { title: "ABC & Letters", icon: Rocket, path: "/games/alphabets", color: "bg-amber-500", progress: 10, lessons: 50 },
    { title: "Shapes & Colors", icon: Sparkles, path: "/games/shapes", color: "bg-rose-500", progress: 15, lessons: 10 },
    { title: "Memory Match", icon: Star, path: "/games/memory", color: "bg-violet-500", progress: 85, lessons: 15 },
    { title: "Sticker Puzzles", icon: Trophy, path: "/games/puzzles", color: "bg-rose-500", progress: 65, lessons: 8 },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(kidsZoneModules.length / itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const currentItems = kidsZoneModules.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fffbeb] p-4 md:p-10 pb-32 space-y-12 overflow-y-auto">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[4rem] border-4 border-amber-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] -rotate-12"><Rocket size={200} /></div>
        
        <div className="flex items-center gap-8 relative z-10 text-center md:text-left">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-7xl drop-shadow-2xl"
          >
            {childProfile.avatar}
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-amber-900 tracking-tighter">
              Welcome to <span className="text-indigo-600">Kids Zone!</span>
            </h1>
            <p className="text-amber-700/60 font-bold text-lg mt-2 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
              <Trophy size={18} className="text-amber-400" /> Play and Learn with {childProfile.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-rose-500 px-6 py-3 rounded-2xl text-white shadow-[0_6px_0_#be123c] border-2 border-white transform rotate-3">
           <span className="text-3xl font-black leading-none">{currentPage + 1}/{totalPages}</span>
           <span className="text-[10px] font-black uppercase tracking-wider opacity-90">Pages</span>
        </div>
      </header>

      <div className="relative flex items-center justify-center gap-4 min-h-[500px]">
        {/* Navigation - Left */}
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevPage}
          className="flex z-20 w-16 h-16 bg-white rounded-full border-4 border-amber-400 items-center justify-center text-amber-500 shadow-xl"
        >
          <Rocket className="rotate-[-135deg]" size={32} strokeWidth={3} />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full"
          >
            {currentItems.map((module) => (
              <SubjectCard 
                key={module.title}
                title={module.title} 
                icon={module.icon} 
                path={module.path} 
                color={module.color} 
                progress={module.progress} 
                lessons={module.lessons} 
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Right */}
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextPage}
          className="flex z-20 w-16 h-16 bg-white rounded-full border-4 border-amber-400 items-center justify-center text-amber-500 shadow-xl"
        >
          <Rocket className="rotate-45" size={32} strokeWidth={3} />
        </motion.button>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center gap-6 mt-12">
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentPage(i)}
            animate={{ 
              scale: currentPage === i ? 1.5 : 1,
              rotate: currentPage === i ? 180 : 0
            }}
            className={`w-8 h-8 rounded-xl rotate-45 border-4 transition-colors ${
              currentPage === i 
                ? 'bg-rose-500 border-rose-600 shadow-lg' 
                : 'bg-white border-rose-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default KidsHub;
