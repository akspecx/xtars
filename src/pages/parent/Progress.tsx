import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

const SubjectProgress = ({ title, score, completed, total, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <BarChart3 className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className="text-right">
        <span className="text-2xl font-black text-slate-800">{score}%</span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery</p>
      </div>
    </div>
    
    <div>
      <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
      <p className="text-slate-500 text-sm">{completed} of {total} modules finished</p>
    </div>

    <div className="space-y-2">
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(completed / total) * 100}%` }}
          className={`h-full ${color}`}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
        <span>Start</span>
        <span>Goal: 100%</span>
      </div>
    </div>

    <button className="w-full py-3 text-slate-600 font-bold text-xs border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
      View Details <ChevronRight size={14} />
    </button>
  </div>
);

const Progress: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Learning Progress</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed performance breakdown across subjects</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" /> Improvement Trend
            </h3>
            <select className="text-xs font-bold border-none bg-slate-100 rounded-lg px-3 py-1 text-slate-600 outline-hidden">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[45, 60, 55, 80, 75, 90, 85].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  className="w-full max-w-[40px] bg-indigo-500 rounded-t-xl relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}%
                  </div>
                </motion.div>
                <span className="text-[10px] font-bold text-slate-400">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Elite Status</h3>
            <p className="text-indigo-100 text-sm opacity-80">
              Your child is performing in the top **5%** of their age category globally.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span>Points Earned</span>
              <span>12,450 XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubjectProgress title="Logical Reasoning" score={92} completed={18} total={20} color="bg-indigo-500" />
        <SubjectProgress title="Visual Math" score={78} completed={12} total={25} color="bg-emerald-500" />
        <SubjectProgress title="Memory Hub" score={85} completed={30} total={40} color="bg-amber-500" />
      </div>

      {/* Engagement Insights */}
      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Target className="text-rose-500" /> Focus Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg. Session Time</span>
            <p className="text-2xl font-black text-slate-800 mt-1">42m 15s</p>
            <span className="text-xs text-emerald-600 font-bold">↑ 5m from last week</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bout Frequency</span>
            <p className="text-2xl font-black text-slate-800 mt-1">2.4 / Day</p>
            <span className="text-xs text-rose-500 font-bold">↓ 0.2 from last week</span>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Days</span>
            <p className="text-2xl font-black text-slate-800 mt-1">22 / 30</p>
            <span className="text-xs text-emerald-600 font-bold">Steady engagement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
