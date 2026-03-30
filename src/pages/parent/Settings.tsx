import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  Moon, 
  Clock, 
  Shield, 
  Bell, 
  Globe,
  Trash2,
  Lock,
  Smartphone
} from 'lucide-react';

const SettingToggle = ({ icon: Icon, title, desc, active, color = "bg-indigo-600" }: any) => (
  <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm group hover:border-slate-300 transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${active ? color : 'bg-slate-100'} bg-opacity-10 transition-colors`}>
        <Icon className={active ? color.replace('bg-', 'text-') : 'text-slate-400'} size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
    <div className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer ${active ? color : 'bg-slate-200'}`}>
      <motion.div 
        animate={{ x: active ? 28 : 4 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
      />
    </div>
  </div>
);

const Settings: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-12 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">App Settings</h1>
        <p className="text-slate-500 font-medium">Fine-tune the XTARS experience for your child</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio & Visual */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Experience</h3>
          <SettingToggle 
            icon={Volume2} 
            title="Background Music" 
            desc="Enable catchy tunes during gameplay" 
            active={true} 
          />
          <SettingToggle 
            icon={Bell} 
            title="Learning Reminders" 
            desc="Get notified about daily goals" 
            active={true} 
          />
          <SettingToggle 
            icon={Moon} 
            title="Dark Interface" 
            desc="Easier on the eyes during evening" 
            active={false} 
            color="bg-slate-800"
          />
        </div>

        {/* Control & Security */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Controls</h3>
          <SettingToggle 
            icon={Clock} 
            title="Session Limits" 
            desc="Cap learning time to 45m/day" 
            active={true} 
            color="bg-rose-500"
          />
          <SettingToggle 
            icon={Lock} 
            title="Strict Mode" 
            desc="Require PIN for all administrative exits" 
            active={true} 
          />
          <SettingToggle 
            icon={Smartphone} 
            title="Offline Mode" 
            desc="Download modules for travel" 
            active={false} 
          />
        </div>
      </div>

      {/* Parental Gate Config */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100"><Shield size={24} className="text-indigo-600" /></div>
          <h3 className="text-xl font-bold text-slate-800">Parental Gate Security</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'math', name: 'Math Challenge', active: true },
            { id: 'pin', name: '4-Digit PIN', active: false },
            { id: 'bio', name: 'Biometric (Face/Touch)', active: false }
          ].map(type => (
            <div key={type.id} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center gap-4 ${type.active ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${type.active ? 'border-indigo-500 bg-white' : 'border-slate-300'}`}>
                {type.active && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
              </div>
              <span className={`font-bold text-sm ${type.active ? 'text-indigo-700' : 'text-slate-500'}`}>{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100"><Globe size={24} className="text-blue-600" /></div>
          <div>
            <h4 className="font-bold text-slate-800">System Language</h4>
            <p className="text-xs text-slate-500">Currently set to English (US)</p>
          </div>
        </div>
        <button className="text-indigo-600 font-bold text-sm bg-indigo-50 px-6 py-2 rounded-xl border border-indigo-100">Change</button>
      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
        <button className="text-rose-500 font-bold text-sm flex items-center gap-2 px-6 py-3 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors">
          <Trash2 size={18} /> Reset All Settings
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version Alpha 1.0.42</span>
      </div>
    </div>
  );
};

export default Settings;
