/**
 * KidsHub.tsx — Screen-1 redesign
 * Yellow home · mascot greeting · continue playing card · 2×2 game grid · tab bar
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ChevronRight, Home, Award, Gamepad2 } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import KidAvatar from '../../x-tars/courses/CommonUtility/KidAvatar';
import { getProgress, getAggregateProgress } from '../../x-tars/courses/CommonUtility/useModuleProgress';

// ─── Subject grid data ────────────────────────────────────────────────────────
const GRID_SUBJECTS = [
  {
    id: 'alphabets',
    title: 'Alphabets',
    path: '/games/alphabets',
    circleBg: '#ff8eaf',
    cardBg: '#ffeff1',
    barColor: '#a7295a',
    titleColor: '#971b4e',
    label: 'ABC',
    labelColor: '#66002f',
    totalScenarios: 26,
  },
  {
    id: 'numbers',
    title: 'Numbers',
    path: '/games/numbers',
    circleBg: '#44a6f6',
    cardBg: '#ecf3ff',
    barColor: '#005f99',
    titleColor: '#005386',
    label: '123',
    labelColor: '#00253f',
    totalScenarios: 30,
  },
  {
    id: 'shapes',
    title: 'Shapes',
    path: '/games/shapes',
    circleBg: '#b9f474',
    cardBg: '#f0ffea',
    barColor: '#3c6600',
    titleColor: '#345900',
    label: '⬡',
    labelColor: '#294700',
    totalScenarios: 8,
  },
  {
    id: 'memory',
    title: 'Animals',
    path: '/games/memory',
    circleBg: '#f0e037',
    cardBg: '#fff9e6',
    barColor: '#837800',
    titleColor: '#342f00',
    label: '🐾',
    labelColor: '#342f00',
    totalScenarios: 10,
  },
];

// ─── Grid card ────────────────────────────────────────────────────────────────
const GridCard: React.FC<{ s: (typeof GRID_SUBJECTS)[0]; onTap: () => void }> = ({ s, onTap }) => {
  const prog  = getProgress(s.id, s.totalScenarios);
  const pct   = prog ? Math.round((prog.scenariosCompletedBest / Math.max(prog.totalScenarios, 1)) * 100) : 0;
  const isEmoji = s.label.length > 3 || /\p{Emoji}/u.test(s.label);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onTap}
      className="flex-1 flex flex-col items-center justify-between rounded-2xl p-4 shadow-lg text-left"
      style={{ background: s.cardBg, minHeight: 170, border: '1.5px solid rgba(0,0,0,0.04)' }}
    >
      <div className="w-full flex justify-center pt-2">
        <motion.div
          className="flex items-center justify-center rounded-full shadow-inner"
          style={{ width: 80, height: 80, background: s.circleBg }}
          animate={{ y: [0, -6, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
        >
          <span
            style={{
              color: s.labelColor,
              fontWeight: 900,
              fontSize: isEmoji ? 34 : 24,
              letterSpacing: -1,
              fontFamily: 'system-ui',
            }}
          >{s.label}</span>
        </motion.div>
      </div>
      <p className="w-full text-center font-black text-xl mt-3" style={{ color: s.titleColor }}>
        {s.title}
      </p>
      {/* Progress bar */}
      <div className="w-full mt-4">
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.max(pct, 4)}%`, background: s.barColor }}
          />
        </div>
      </div>
    </motion.button>
  );
};

// ─── Tab bar ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',   label: 'HOME',   Icon: Home   },
  { id: 'play',   label: 'PLAY',   Icon: Gamepad2 },
  { id: 'awards', label: 'AWARDS', Icon: Award  },
];

const TabBar: React.FC<{ active: string; onChange: (id: string) => void }> = ({ active, onChange }) => (
  <div
    className="flex-none flex items-center justify-around px-4 rounded-t-[2rem] shadow-[0_-8px_32px_rgba(52,47,0,0.1)]"
    style={{
      background: '#f6e54a',
      height: 80,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}
  >
    {TABS.map(({ id, label, Icon }) => {
      const isActive = id === active;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className="flex flex-col items-center justify-center gap-0.5 px-5 py-2 transition-all active:scale-90"
          style={{
            borderRadius: 9999,
            background: isActive ? '#b9f474' : 'transparent',
          }}
        >
          <Icon size={24} color="#342f00" strokeWidth={isActive ? 2.5 : 1.8} fill={isActive ? '#342f00' : 'none'} />
          <span className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: '#342f00', opacity: isActive ? 1 : 0.6 }}>
            {label}
          </span>
        </button>
      );
    })}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function KidsHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const { activeProfile } = useProfile();

  const kidName   = activeProfile?.name ?? 'Friend';
  const kidAvatar = activeProfile?.avatar ?? 'bird';

  const nav = (path: string) => navigate(path, { state: { fromProfileSelection: true } });

  const vlIds = ['big','small','big-small-mix','tall','short','tall-short','above','below','above-below-mix','inside','outside','inside-outside-mix','full','empty','full-empty','same','different'];
  const vlProg = getAggregateProgress('visuallogic', vlIds);
  const vlPct  = vlProg ? Math.round((vlProg.scenariosCompletedBest / Math.max(vlProg.totalScenarios, 1)) * 100) : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#fff7cc' }}>

      {/* ── Scrollable body ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-4 pb-4" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>

          {/* Mascot greeting */}
          <section className="flex items-end gap-5 mb-8 relative pt-6">
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/profiles')}
              className="shrink-0 cursor-pointer"
              style={{ width: '30%', transform: 'rotate(-6deg)' }}
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-indigo-600 shadow-xl flex items-center justify-center">
                <KidAvatar avatar={kidAvatar} size={90} />
              </div>
              {/* small swap hint */}
              <div className="mt-1 flex justify-center">
                <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: '#fbeb5b', color: '#342f00' }}>tap to change</span>
              </div>
            </motion.div>
            <div className="flex-1 pb-2">
              <h1 className="font-black leading-tight" style={{ fontSize: 36, color: '#342f00' }}>
                Hi {kidName}!
              </h1>
              <p className="font-black text-3xl italic" style={{ color: '#005f99' }}>
                Let's play!
              </p>
            </div>
          </section>

          {/* Continue Playing card */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => nav('/games/visuallogic')}
            className="rounded-2xl overflow-hidden mb-5 group active:scale-95 transition-all duration-200 cursor-pointer"
            style={{ background: '#ffffff', boxShadow: '0 8px 32px rgba(52,47,0,0.08)', borderBottom: '12px solid #fbeb5b' }}
          >
            {/* Thumbnail area */}
            <div
              className="w-full flex items-center justify-center relative"
              style={{
                height: 160,
                background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #4fc3f7 0%, #0277bd 40%, #01579b 70%, transparent 100%)',
                  boxShadow: '0 0 60px #4fc3f780',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: 56 }}>🧩</span>
              </div>
            </div>
            <div className="px-4 pt-3 pb-4">
              <span className="font-bold text-sm uppercase tracking-widest" style={{ color: '#971b4e' }}>Continue Playing</span>
              <p className="font-black text-3xl" style={{ color: '#342f00' }}>Visual Logic</p>
              <div className="flex items-center gap-1.5 mt-2 mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="rounded-full transition-all"
                    style={{ width: 10, height: 10,
                      background: i < Math.round(vlPct / 20) ? '#3c6600' : 'rgba(52,47,0,0.12)' }}
                  />
                ))}
              </div>
              <div className="w-full h-6 rounded-full overflow-hidden p-1 mb-4" style={{ background: '#fbeb5b' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(vlPct, 4)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: '#3c6600' }}
                />
              </div>
              <button
                className="w-full py-4 rounded-full font-bold text-xl text-on-primary flex items-center justify-center gap-2"
                style={{ background: '#005f99', color: '#ecf3ff', boxShadow: '0 6px 0 #005386' }}
              >
                Play Now <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          {/* 2×2 Game grid */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            {GRID_SUBJECTS.map(s => (
              <GridCard key={s.id} s={s} onTap={() => nav(s.path)} />
            ))}
          </div>

          {/* Notification strip */}
          <div className="flex justify-end items-center gap-3 mt-2 group">
            <div
              className="bg-white p-3 rounded-2xl shadow-lg relative border-2 max-w-[200px]"
              style={{ borderColor: '#fbeb5b' }}
            >
              <p className="font-bold text-sm leading-snug" style={{ color: '#342f00' }}>
                You've earned 3 new stickers today!
              </p>
              <div
                className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 rotate-45"
                style={{ borderColor: '#fbeb5b' }}
              />
            </div>
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 shrink-0 flex items-center justify-center">
              <KidAvatar avatar={kidAvatar} size={60} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <TabBar active={activeTab} onChange={(id) => {
        setActiveTab(id);
        if (id === 'play') nav('/games/visuallogic');
        if (id === 'awards') nav('/games');
      }} />
    </div>
  );
}
