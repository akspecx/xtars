import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Gamepad2, 
  BrainCircuit, 
  ShieldCheck, 
  ChevronRight,
  Play
} from 'lucide-react';

const IntroStep = ({ number, title, desc, icon: Icon }: any) => (
  <div className="flex gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 font-black text-8xl text-indigo-600">
      {number}
    </div>
    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100">
      <Icon size={32} />
    </div>
    <div className="space-y-2 relative z-10">
      <h3 className="text-xl font-bold text-slate-800">{number}. {title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const PlatformIntro: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-16 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-indigo-100"
        >
          <Sparkles size={16} /> Welcome to XTARS
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter max-w-3xl mx-auto leading-tight">
          A Universe of Learning <span className="text-indigo-600">Built for Curiosity</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          XTARS combines cognitive science with immersive gameplay to help your child master complex skills in a safe, fun environment.
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="aspect-video bg-slate-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex items-center justify-center group cursor-pointer">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=2022')] bg-cover bg-center opacity-40 grayscale group-hover:scale-105 transition-transform duration-1000" />
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-all">
          <Play size={40} className="text-indigo-600 fill-current ml-2" />
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/60 font-black uppercase text-[10px] tracking-widest z-10">
          <span>Watch the 2-minute overview</span>
          <span>Press Play to Start</span>
        </div>
      </div>

      {/* The Journey */}
      <div className="space-y-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">How the Journey Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntroStep 
            number={1} 
            title="Choose a Path" 
            desc="Your child selects from Logic, Math, or Memory paths, each custom-designed for their age group." 
            icon={Gamepad2}
          />
          <IntroStep 
            number={2} 
            title="Gamified Mastery" 
            desc="Interactive modules use immediate feedback and visual rewards to keep engagement high." 
            icon={Sparkles}
          />
          <IntroStep 
            number={3} 
            title="Cognitive Growth" 
            desc="Our algorithms adapt to your child's pace, ensuring they are always challenged but never overwhelmed." 
            icon={BrainCircuit}
          />
          <IntroStep 
            number={4} 
            title="Safe & Secure" 
            desc="Parents have full control through the Parent Hub, with activity reports and safety locks." 
            icon={ShieldCheck}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl shadow-indigo-200">
        <h2 className="text-4xl font-black text-white tracking-tight">Ready to see {`Prabhat's`} progress?</h2>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2">
            Go to Dashboard <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformIntro;
