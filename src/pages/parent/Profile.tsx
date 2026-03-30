import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Camera, 
  Save, 
  Trash2, 
  ChevronRight,
  Sparkles,
  Shield,
  Star
} from 'lucide-react';

import { useMode } from '../../context/ModeContext';

const Profile: React.FC = () => {
  const { childProfile, updateProfile } = useMode();
  const [localProfile, setLocalProfile] = React.useState(childProfile);

  const handleSave = () => {
    updateProfile(localProfile);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><Sparkles size={120} /></div>
        
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-inner border-4 border-white">
            {localProfile.avatar}
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg text-indigo-600 hover:bg-slate-50 transition-colors">
            <Camera size={20} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{localProfile.name}</h1>
            <p className="text-slate-500 font-bold text-lg">{localProfile.age} years old • Student Member</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">Logic Pro</div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">Math Explorer</div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Child Identity */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <User className="text-indigo-600" /> Basic Details
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Display Name</label>
              <input 
                type="text" 
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Current Age</label>
              <input 
                type="number" 
                value={localProfile.age}
                onChange={(e) => setLocalProfile({ ...localProfile, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Access & Security */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Shield className="text-emerald-600" /> Permissions
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Child Lock Mode</p>
                <p className="text-xs text-slate-500">Prevent exiting without PIN</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
              <div>
                <p className="font-bold text-slate-800">Unrestricted Social</p>
                <p className="text-xs text-slate-500">Enable peer interactions</p>
              </div>
              <div className="w-12 h-6 bg-slate-300 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-8">
          <Star className="text-amber-500" /> Current Focus Goals
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Master Multiplication', 'Finish Logic level 5', 'Daily Streak: 14D', 'Memory Gold Medal'].map((goal, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4 group hover:bg-slate-100 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-200 group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all" />
              </div>
              <span className="font-bold text-slate-700 leading-tight">{goal}</span>
            </div>
          ))}
          <button className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
            <span className="text-2xl font-bold">+</span>
            <span className="text-xs font-bold uppercase tracking-widest">Add New Goal</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button className="flex items-center gap-2 text-rose-500 font-bold hover:text-rose-600 transition-colors bg-rose-50 px-6 py-3 rounded-2xl">
          <Trash2 size={18} /> Delete Profile and All Progress
        </button>
      </div>
    </div>
  );
};

export default Profile;
