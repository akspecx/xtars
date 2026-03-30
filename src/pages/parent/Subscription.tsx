import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle, 
  Sparkles, 
  History, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';

const PlanFeature = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 text-slate-600 font-medium">
    <CheckCircle size={18} className="text-emerald-500 shrink-0" />
    <span className="text-sm">{text}</span>
  </div>
);

const Subscription: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-12 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Membership</h1>
        <p className="text-slate-500 font-medium">Manage your XTARS subscription and billing</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
          <Zap size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">
              <Sparkles size={14} /> Active Plan
            </div>
            <h2 className="text-5xl font-black tracking-tighter">XTARS PRO</h2>
            <p className="text-indigo-100 text-lg opacity-80 font-medium">Full access to 150+ interactive modules</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[200px]">
            <span className="text-sm font-bold opacity-60 uppercase tracking-widest">Next Renewal</span>
            <p className="text-2xl font-black mt-1">Oct 24, 2026</p>
            <p className="text-indigo-200 text-xs font-bold mt-2">$14.99 / Month</p>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-white/10 flex flex-wrap gap-8 relative z-10">
          <PlanFeature text="Unlimited Courses" />
          <PlanFeature text="Advanced Analytics" />
          <PlanFeature text="AI Learning Coaching" />
          <PlanFeature text="Multi-device Sync" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Method */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <CreditCard className="text-indigo-600" /> Payment Method
          </h3>
          
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center text-white text-[8px] font-black">VISA</div>
              <div>
                <p className="font-bold text-slate-800">Visa ending in 4242</p>
                <p className="text-xs text-slate-500 font-medium">Expires 12/28</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600" />
          </div>
          
          <button className="w-full py-4 text-indigo-600 font-bold text-sm bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all">
            Update Payment Method
          </button>
        </div>

        {/* Plan Management */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Package className="text-emerald-600" /> Plan Management
          </h3>
          
          <div className="space-y-4">
            <button className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-100 transition-all">
              <div className="text-left">
                <p className="font-bold text-slate-800">Review Invoices</p>
                <p className="text-xs text-slate-500">Download past billing reports</p>
              </div>
              <History size={20} className="text-slate-400" />
            </button>
            <button className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-rose-50 hover:border-rose-100 transition-all">
              <div className="text-left">
                <p className="font-bold text-slate-800 text-rose-600">Cancel Membership</p>
                <p className="text-xs text-slate-500">Switch back to basic plan</p>
              </div>
              <ShieldCheck size={20} className="text-rose-400 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
