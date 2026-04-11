"""Helper: overwrite KidsModuleLandingPage.tsx with new Screen-2/5 design."""
import os, pathlib

TARGET = pathlib.Path(__file__).parent / "KidsModuleLandingPage.tsx"

NEW_CONTENT = '''\
/**
 * KidsModuleLandingPage.tsx
 * Mobile  (Screen 2): back + title + Level badge + vertical card list
 * Desktop (Screen 5): sidebar + 4-col grid + progress stats
 */
import React, { useEffect, useState } from \'react\';
import { motion } from \'framer-motion\';
import { useNavigate } from \'react-router-dom\';
import {
  ChevronLeft, Home, LayoutDashboard,
  FlaskConical, Palette, BookA,
} from \'lucide-react\';
import { getProgress, recordVisit, ModuleProgress } from \'./useModuleProgress\';
import KidAvatar from \'./KidAvatar\';
import { useProfile } from \'../../../context/ProfileContext\';

// ─── Public Types ─────────────────────────────────────────────────────────────
export interface KidsGameEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconPair?: [string, string];
  path: string;
  gradient?: string;
  category?: string;
  totalScenarios?: number;
  imageGradient?: string;
}

export interface KidsModuleLandingPageProps {
  moduleTitle: string;
  moduleEmoji: string;
  headerGradient?: string;
  bgColor?: string;
  games: KidsGameEntry[];
  footer?: React.ReactNode;
  pageSize?: number;
  onBack?: () => void;
  sectionTitle?: string;
}

// ─── KidsPageHeader (exported – used by game sub-pages) ───────────────────────
export interface KidsPageHeaderProps {
  title: string;
  emoji: string;
  subtitle?: string;
  onBack: () => void;
}

export const KidsPageHeader: React.FC<KidsPageHeaderProps> = ({
  title, emoji, subtitle, onBack,
}) => (
  <div
    className="relative z-10 w-full bg-white border-b border-gray-100 shadow-sm"
    style={{ paddingTop: \'env(safe-area-inset-top, 12px)\' }}
  >
    <div className="flex items-center gap-3 px-4 pt-3 pb-3">
      <motion.button
        whileTap={{ scale: 0.86 }}
        onClick={onBack}
        className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 shadow-sm shrink-0"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </motion.button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-3xl leading-none">{emoji}</span>
        <div className="min-w-0">
          <p className="text-gray-800 font-black text-xl leading-tight tracking-tight truncate">{title}</p>
          {subtitle && <p className="text-gray-400 text-[11px] font-bold">{subtitle}</p>}
        </div>
      </div>
      <div className="bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full shrink-0">
        ● Level 1
      </div>
    </div>
  </div>
);

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  { id: \'home\',    label: \'Home\',         Icon: Home,            path: \'/games\' },
  { id: \'numbers\', label: \'Numbers\',      Icon: LayoutDashboard, path: \'/games/numbers\' },
  { id: \'shapes\',  label: \'Shapes\',       Icon: FlaskConical,    path: \'/games/shapes\' },
  { id: \'alpha\',   label: \'Alphabets\',    Icon: Palette,         path: \'/games/alphabets\' },
  { id: \'logic\',   label: \'Visual Logic\', Icon: BookA,           path: \'/games/visuallogic\' },
];

const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  return (
    <div className="hidden lg:flex flex-col w-[220px] flex-none bg-white border-r border-gray-100 h-full">
      <div className="flex flex-col items-center pt-8 pb-5 px-4 border-b border-gray-50">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm mb-3">
          <KidAvatar avatar={activeProfile?.avatar ?? \'bird\'} size={52} />
        </div>
        <p className="font-black text-sm text-gray-800">Hi, Explorer!</p>
        <p className="text-xs text-gray-400 mt-0.5">Level 12 Scholar</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {SIDEBAR_NAV.map(({ id, label, Icon, path }) => (
          <button
            key={id}
            onClick={() => navigate(path, { state: { fromProfileSelection: true } })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-gray-600 hover:bg-gray-50"
          >
            <Icon size={18} strokeWidth={1.8} />
            <span className="text-sm font-semibold">{label}</span>
          </button>
        ))}
      </nav>
      <div className="px-3 pb-6">
        <button
          onClick={() => navigate(\'/games/visuallogic\', { state: { fromProfileSelection: true } })}
          className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-black text-sm rounded-xl shadow-md"
        >
          Daily Quest
        </button>
      </div>
    </div>
  );
};

// ─── Mobile Card (vertical list, full-width) ──────────────────────────────────
interface MobileCardProps {
  entry: KidsGameEntry;
  progress: ModuleProgress | null;
  index: number;
  onTap: () => void;
}

const MobileCard: React.FC<MobileCardProps> = ({ entry, progress, index, onTap }) => {
  const pct = progress
    ? Math.round((progress.scenariosCompletedBest / Math.max(progress.totalScenarios, 1)) * 100)
    : 0;
  const grad = entry.imageGradient ?? entry.gradient ?? \'from-indigo-400 to-purple-500\';

  const handleTap = () => {
    if (entry.id) recordVisit(entry.id, entry.totalScenarios ?? 8);
    onTap();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleTap}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-sm text-left"
      style={{ border: \'1.5px solid #F0F4FF\' }}
    >
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-br ${grad} relative overflow-hidden`}
        style={{ height: 148 }}
      >
        <span
          className="absolute opacity-10 text-[120px] leading-none select-none pointer-events-none"
          style={{ right: \'-5%\', bottom: \'-15%\' }}
        >
          {entry.iconPair ? entry.iconPair[0] : entry.icon}
        </span>
        {entry.iconPair ? (
          <div className="flex items-end justify-center gap-6 z-10">
            <motion.span
              className="text-[68px] leading-none select-none drop-shadow-xl"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: \'easeInOut\' }}
            >
              {entry.iconPair[0]}
            </motion.span>
            <motion.span
              className="text-[44px] leading-none select-none drop-shadow-lg mb-1"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: \'easeInOut\', delay: 0.5 }}
            >
              {entry.iconPair[1]}
            </motion.span>
          </div>
        ) : (
          <motion.span
            className="text-[64px] leading-none select-none drop-shadow-lg z-10"
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            {entry.icon}
          </motion.span>
        )}
      </div>

      <div className="px-4 pt-3 pb-3">
        <p className="font-black text-gray-800 text-base">{entry.title}</p>
        <p className="text-xs text-gray-400 mt-0.5 mb-2">{entry.subtitle}</p>
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: index * 0.06 + 0.3 }}
            className="h-full rounded-full bg-blue-500"
          />
        </div>
      </div>
    </motion.button>
  );
};

// ─── Desktop Card (4-col grid) ────────────────────────────────────────────────
interface DesktopCardProps {
  entry: KidsGameEntry;
  progress: ModuleProgress | null;
  index: number;
  onTap: () => void;
}

const DesktopCard: React.FC<DesktopCardProps> = ({ entry, progress, index, onTap }) => {
  const pct = progress
    ? Math.round((progress.scenariosCompletedBest / Math.max(progress.totalScenarios, 1)) * 100)
    : 0;
  const done = progress?.scenariosCompletedBest ?? 0;
  const total = progress?.totalScenarios ?? (entry.totalScenarios ?? 20);
  const label =
    pct >= 100 ? \'Mastered!\' : pct === 0 ? \'Not Started\' : pct < 10 ? \'Started\' : `${pct}% Complete`;
  const labelColor = pct >= 100 ? \'#10B981\' : pct === 0 ? \'#9CA3AF\' : \'#3B82F6\';
  const grad = entry.imageGradient ?? entry.gradient ?? \'from-indigo-400 to-purple-500\';

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        if (entry.id) recordVisit(entry.id, entry.totalScenarios ?? 8);
        onTap();
      }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm text-left hover:shadow-md transition-shadow border border-gray-100"
    >
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-br ${grad} relative overflow-hidden`}
        style={{ height: 130 }}
      >
        <span
          className="absolute opacity-10 text-[80px] leading-none select-none"
          style={{ right: \'-5%\', bottom: \'-5%\' }}
        >
          {entry.iconPair ? entry.iconPair[0] : entry.icon}
        </span>
        {entry.iconPair ? (
          <div className="flex items-end justify-center gap-4 z-10">
            <motion.span
              className="text-[52px] leading-none select-none drop-shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {entry.iconPair[0]}
            </motion.span>
            <motion.span
              className="text-[36px] leading-none select-none drop-shadow-md mb-1"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
            >
              {entry.iconPair[1]}
            </motion.span>
          </div>
        ) : (
          <span className="text-[52px] leading-none select-none drop-shadow-lg z-10">{entry.icon}</span>
        )}
      </div>

      <div className="px-3 pt-2.5 pb-3">
        <p className="font-black text-gray-800 text-sm leading-tight">{entry.title}</p>
        <div className="flex items-center justify-between mt-1 mb-1.5">
          <span className="text-[11px] font-bold" style={{ color: labelColor }}>{label}</span>
          <span className="text-[11px] text-gray-400">{done}/{total}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: pct >= 100 ? \'#10B981\' : \'#3B82F6\' }}
          />
        </div>
      </div>
    </motion.button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const KidsModuleLandingPage: React.FC<KidsModuleLandingPageProps> = ({
  moduleTitle,
  moduleEmoji,
  bgColor = \'#F8FBFF\',
  games,
  footer,
  onBack,
  sectionTitle = \'Compare & Learn\',
}) => {
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});
  const totalPoints = 1540;

  useEffect(() => {
    const map: Record<string, ModuleProgress> = {};
    games.forEach(g => { map[g.id] = getProgress(g.id, g.totalScenarios ?? 8); });
    setProgressMap(map);
  }, [games]);

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    navigate(-1);
  };
  const nav = (path: string) => navigate(path, { state: { fromProfileSelection: true } });

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: bgColor }}>

      {/* ── Desktop layout ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex h-full overflow-hidden">
        <DesktopSidebar />

        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <div className="flex items-center gap-4 px-8 pt-8 pb-4 bg-white border-b border-gray-100 flex-none">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex-1">
              <h1 className="font-black text-2xl text-gray-800">{moduleEmoji} {moduleTitle}</h1>
              <p className="text-gray-400 text-sm">Compare, contrast, and master visual concepts</p>
            </div>
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-2">
              <span className="text-pink-500 font-black text-sm">✦ {games.length} Activities Available</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: \'none\' }}>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {games.map((entry, i) => (
                <DesktopCard
                  key={entry.id}
                  entry={entry}
                  progress={progressMap[entry.id] ?? null}
                  index={i}
                  onTap={() => nav(entry.path)}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 bg-indigo-600 rounded-2xl p-5 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-white font-black text-base">Ready for the Grand Finals?</p>
                  <p className="text-white/70 text-xs mt-1">
                    Complete all {moduleTitle} activities to unlock the "Master Observer" legendary badge.
                  </p>
                </div>
                <button className="bg-white text-indigo-600 font-black text-sm px-5 py-3 rounded-xl ml-4 shrink-0 hover:bg-indigo-50 transition-colors shadow-md">
                  Final Challenge
                </button>
              </div>
              <div className="w-44 bg-teal-500 rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg">
                <span className="text-3xl mb-1">🏆</span>
                <p className="text-white font-black text-xl">{totalPoints.toLocaleString()}</p>
                <p className="text-white/80 text-xs text-center mt-0.5 font-semibold">SCHOLAR POINTS EARNED</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile layout ────────────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col h-full overflow-hidden">
        <div
          className="flex-none bg-white border-b border-gray-100 shadow-sm"
          style={{ paddingTop: \'env(safe-area-inset-top, 14px)\' }}
        >
          <div className="flex items-center gap-3 px-4 pt-3 pb-3">
            <motion.button
              whileTap={{ scale: 0.86 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 shrink-0"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </motion.button>
            <p className="flex-1 font-black text-xl text-gray-800 leading-tight truncate">
              {moduleEmoji} {moduleTitle}
            </p>
            <div className="bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full shrink-0">
              ● Level 1
            </div>
          </div>
        </div>

        <div className="flex-none px-5 pt-5 pb-3">
          <h2 className="font-black text-2xl text-gray-800">{sectionTitle}</h2>
        </div>

        <div
          className="flex-1 overflow-y-auto px-5 pb-6 space-y-4"
          style={{ scrollbarWidth: \'none\' }}
        >
          {games.map((entry, i) => (
            <MobileCard
              key={entry.id}
              entry={entry}
              progress={progressMap[entry.id] ?? null}
              index={i}
              onTap={() => nav(entry.path)}
            />
          ))}
          {footer && <div className="mt-2">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default KidsModuleLandingPage;
'''

TARGET.write_text(NEW_CONTENT)
lines = NEW_CONTENT.count('\n')
print(f"Written {lines} lines to {TARGET.name}")
