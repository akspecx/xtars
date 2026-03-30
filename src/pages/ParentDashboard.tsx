import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Zap, 
  Calendar,
  ChevronRight,
  Target,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { useMode } from '../context/ModeContext';

// --- Components ---

const StatCard = memo(({ title, value, sub, icon: Icon, trend, color = "text-slate-900" }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden group"
  >
    <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700">
      {Icon && <Icon size={120} />}
    </div>
    <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{title}</span>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-black ${color} tracking-tight tabular-nums`}>{value}</span>
      {trend !== undefined && (
        <span className={`text-xs font-bold flex items-center ${trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <span className="text-xs font-medium text-slate-400">{sub}</span>
  </motion.div>
));

const ActivityRow = ({ module, progress, time, date }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
        <BookOpen size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{module}</h4>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
          <span className="flex items-center gap-1"><Clock size={12} /> {time}m</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="hidden sm:flex flex-col items-end gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-indigo-500"
          />
        </div>
      </div>
      <span className="font-bold text-slate-700 w-12 text-right">{progress}%</span>
      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
);

const ParentDashboard: React.FC = () => {
  const { childProfile } = useMode();
  const childName = childProfile.name;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Parent Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Monitoring {childName}'s learning journey</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 shadow-sm">
            <Zap size={18} />
            <span className="text-sm font-bold">Secure Admin Mode</span>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Learning Time" value="12.5h" sub="This Week" icon={Clock} trend={15} color="text-indigo-600" />
        <StatCard title="Modules Completed" value="24" sub="Across all subjects" icon={Award} trend={8} color="text-emerald-600" />
        <StatCard title="Daily Streak" value="7 Days" sub="Best: 12 Days" icon={Zap} color="text-amber-500" />
        <StatCard title="Avg. Accuracy" value="88%" sub="+2% from last week" icon={Target} trend={2} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100"><Activity size={20} className="text-indigo-600" /></div>
                <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
              </div>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              <ActivityRow module="Logical Reasoning: Linear Arrangement" progress={85} time={45} date="Today" />
              <ActivityRow module="Math: Addition with Carry" progress={100} time={30} date="Yesterday" />
              <ActivityRow module="Visual Logic: Pattern Completion" progress={45} time={15} date="Yesterday" />
              <ActivityRow module="Logical Reasoning: Clock Fundamentals" progress={92} time={50} date="2 days ago" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <BrainCircuit size={160} />
            </div>
            <div className="relative z-10 max-w-lg">
              <h3 className="text-2xl font-bold mb-4">AI Coaching Insight</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                {childName} is showing exceptional speed in **Logical Reasoning**, but could benefit from more focus on **Multi-step Math problems**. We suggest introducing "Equations with Fractions" next.
              </p>
              <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                Personalize Curriculum
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mastery & Recommended */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Skill Mastery</h3>
            
            <div className="space-y-6 w-full">
              {[
                { label: 'Logic', val: 92, color: 'bg-indigo-500' },
                { label: 'Math', val: 78, color: 'bg-emerald-500' },
                { label: 'Memory', val: 85, color: 'bg-amber-500' },
                { label: 'Focus', val: 64, color: 'bg-rose-500' }
              ].map(skill => (
                <div key={skill.label} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">{skill.label}</span>
                    <span className="text-slate-500">{skill.val}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.val}%` }}
                      className={`h-full ${skill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-10 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              Detailed Skills Breakdown
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-20"><TrendingUp size={120} /></div>
            <h3 className="text-xl font-bold mb-2">Next Milestone</h3>
            <p className="text-indigo-100 text-sm mb-6 opacity-80">90% completion across all Logical Reasoning basics.</p>
            <div className="flex items-center gap-4">
               <div className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
                 Goal: End of Week
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
