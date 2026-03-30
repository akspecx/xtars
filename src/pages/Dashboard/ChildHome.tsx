import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  Puzzle, 
  Gamepad2, 
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
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center text-sm font-bold text-amber-600">
                {i === 3 ? '+' : <Star size={14} className="fill-current" />}
              </div>
            ))}
          </div>
          <div className={`p-4 rounded-2xl ${color} text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ChildHome: React.FC = () => {
  const { childProfile } = useMode();

  return (
    <div className="min-h-screen bg-[#fffbeb] p-4 md:p-10 pb-32 space-y-12">
      {/* Hero / Greeting */}
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
              Hi, <span className="text-indigo-600">{childProfile.name}!</span>
            </h1>
            <p className="text-amber-700/60 font-bold text-lg mt-2 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
              <Trophy size={18} className="text-amber-400" /> Master of Logic • Level {Math.floor(childProfile.age + 2)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <div className="bg-amber-50 px-8 py-4 rounded-[2rem] border-2 border-amber-100 text-center shadow-inner">
            <span className="text-xs font-black text-amber-900/40 uppercase tracking-widest">Stars Gained</span>
            <p className="text-3xl font-black text-amber-600 mt-1">1,240 ★</p>
          </div>
        </div>
      </header>

      {/* Grid of Learning Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <SubjectCard 
          title="Logical Reasoning" 
          icon={Puzzle} 
          path="/learn/logicalreasoning" 
          color="bg-indigo-500" 
          progress={45} 
          lessons={12} 
        />
        <SubjectCard 
          title="Math Mastery" 
          icon={Brain} 
          path="/learn/mathematics" 
          color="bg-emerald-500" 
          progress={30} 
          lessons={24} 
        />
        <SubjectCard 
          title="Memory Games" 
          icon={Star} 
          path="/games/memory" 
          color="bg-rose-500" 
          progress={85} 
          lessons={15} 
        />
        <SubjectCard 
          title="The Playground" 
          icon={Gamepad2} 
          path="/games" 
          color="bg-amber-500" 
          progress={10} 
          lessons={50} 
        />
        <SubjectCard 
          title="Puzzles Hub" 
          icon={Trophy} 
          path="/puzzles" 
          color="bg-violet-500" 
          progress={65} 
          lessons={8} 
        />
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default ChildHome;
