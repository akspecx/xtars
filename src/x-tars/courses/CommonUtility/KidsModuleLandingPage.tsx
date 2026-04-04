/**
 * KidsModuleLandingPage.tsx
 * ─────────────────────────────────────────────────────────
 * Shared shell for ALL kids module landing pages.
 * Features:
 *  - Always-visible back button (navigate -1)
 *  - 2-col paginated game grid (6 per page)
 *  - Fixed-height cards with NEW / progress indicators
 *  - Progress tracked via useModuleProgress (localStorage)
 *  - Cartoon floating watermarks
 */

import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProgress, recordVisit, ModuleProgress } from './useModuleProgress';

// ─── Public Types ──────────────────────────────────────────────────────────────

export interface KidsGameEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  /** Optional pair [primary, contrast] — shows 2 animated icons for concept comparison */
  iconPair?: IconPair;
  path: string;
  gradient?: string;         // tailwind: "from-sky-500 to-blue-500"
  category?: string;         // optional grouping label
  totalScenarios?: number;   // for progress tracking; defaults to 8
}

export interface KidsModuleLandingPageProps {
  /** Display title shown in the header */
  moduleTitle: string;
  /** Large emoji for module identity */
  moduleEmoji: string;
  /** Tailwind gradient for header accent: "from-violet-500 to-indigo-600" */
  headerGradient?: string;
  /** Background color of the page */
  bgColor?: string;
  /** Array of game / sub-module entries */
  games: KidsGameEntry[];
  /** Extra content rendered below the grid (optional) */
  footer?: React.ReactNode;
  /** Items per page (default 6) */
  pageSize?: number;
  /** Called when navigate(-1) is triggered; skip to override */
  onBack?: () => void;
}

// Dual-icon pair: [primaryEmoji, contrastEmoji] (e.g. ['🐘','🐜'] for Big)
export type IconPair = [string, string];

// Accent gradient map (matches KidsHub AccentColors)
const ACCENT_MAP: Record<string, string> = {
  violet: 'from-violet-500 to-indigo-600',
  rose:   'from-rose-500 to-pink-500',
  amber:  'from-amber-500 to-orange-500',
  teal:   'from-teal-500 to-sky-500',
  green:  'from-green-600 to-emerald-600',
  pink:   'from-pink-600 to-purple-600',
};

// ─── Floating Watermarks ─────────────────────────────────────────────────────

// ─ KidsPageHeader (exported — used by sub-game pages inside modules) ─────────

export interface KidsPageHeaderProps {
  title: string;
  emoji: string;
  subtitle?: string;
  onBack: () => void;
}

export const KidsPageHeader: React.FC<KidsPageHeaderProps> = ({ title, emoji, subtitle, onBack }) => {
  const [grad, setGrad] = useState<string>(() => {
    const id = localStorage.getItem('kids_accent_color');
    return id && ACCENT_MAP[id] ? ACCENT_MAP[id] : 'from-violet-500 to-indigo-600';
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setGrad(id && ACCENT_MAP[id] ? ACCENT_MAP[id] : 'from-violet-500 to-indigo-600');
    };
    window.addEventListener('kids-accent-change', handler);
    return () => window.removeEventListener('kids-accent-change', handler);
  }, []);

  return (
    <div className={`relative z-10 w-full bg-gradient-to-br ${grad} pb-4`}
      style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <motion.button
          whileTap={{ scale: 0.86 }}
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center text-white shadow-md shrink-0"
        >
          <ChevronLeft size={22} strokeWidth={3} />
        </motion.button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-3xl leading-none">{emoji}</span>
          <div className="min-w-0">
            <p className="text-white font-black text-xl leading-tight tracking-tight truncate">{title}</p>
            {subtitle && <p className="text-white/70 text-[11px] font-bold">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Floating Watermarks ─────────────────────────────────────────────────────

const Watermarks: React.FC<{ emoji: string }> = ({ emoji }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
    {[
      { top: '3%', left: '4%',  size: '10vw', delay: 0,   dur: 9  },
      { top: '12%',right: '5%', size: '7vw',  delay: 1.5, dur: 11 },
      { bottom:'8%',left: '7%', size: '9vw',  delay: 0.5, dur: 8  },
      { bottom:'15%',right:'6%',size: '8vw',  delay: 2,   dur: 13 },
    ].map((s, i) => (
      <motion.div
        key={i}
        className="absolute text-black/[0.06] dark:text-white/[0.05]"
        style={{ fontSize: s.size, ...s } as React.CSSProperties}
        animate={{ y: [0, -12, 0], rotate: [i % 2 === 0 ? -8 : 8, i % 2 === 0 ? -3 : 3, i % 2 === 0 ? -8 : 8] }}
        transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
      >
        {emoji}
      </motion.div>
    ))}
  </div>
);

// ─── Individual Game Card ─────────────────────────────────────────────────────

const CARD_HEIGHT = 164; // px — fixed for ALL cards

interface GameCardProps {
  entry: KidsGameEntry;
  progress: ModuleProgress | null;
  index: number;
  onTap: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ entry, progress, index, onTap }) => {
  const isNew     = !progress || progress.visitCount === 0;
  const pct       = progress
    ? Math.round((progress.scenariosCompletedBest / Math.max(progress.totalScenarios, 1)) * 100)
    : 0;
  const isDone    = pct >= 100;
  const gradient  = entry.gradient ?? 'from-violet-500 to-indigo-500';

  const handleTap = () => {
    if (entry.id) recordVisit(entry.id, entry.totalScenarios ?? 8);
    onTap();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.05 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleTap}
      className={`relative rounded-[1.75rem] overflow-hidden text-left bg-gradient-to-br ${gradient} shadow-lg`}
      style={{ height: CARD_HEIGHT }}
    >
      {/* Faint bg watermark */}
      <span className="absolute text-[80px] leading-none opacity-10 select-none pointer-events-none"
        style={{ right: '-5%', bottom: '-10%' }}>
        {entry.iconPair ? entry.iconPair[0] : entry.icon}
      </span>

      {/* Top badges */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
        {isDone ? (
          <span className="bg-white/90 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
            ✅ Done
          </span>
        ) : isNew ? (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
            ✨ NEW
          </motion.span>
        ) : (
          <span className="bg-white/90 text-violet-700 text-[9px] font-black px-2 py-0.5 rounded-full shadow">
            {pct}%
          </span>
        )}
      </div>

      {/* Main icon — single sway OR dual-contrast pair */}
      <div className="absolute inset-0 flex items-center justify-center z-[5]">
        {entry.iconPair ? (
          <div className="flex items-end gap-2">
            {/* Primary (concept) icon — larger, sways gently */}
            <motion.span
              className="text-6xl leading-none select-none drop-shadow-xl"
              animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
              transition={{ duration: 2.4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {entry.iconPair[0]}
            </motion.span>
            {/* Contrast icon — smaller, sways opposite */}
            <motion.span
              className="text-3xl leading-none select-none drop-shadow-lg mb-2"
              animate={{ rotate: [6, -6, 6], y: [0, 4, 0] }}
              transition={{ duration: 2.4 + index * 0.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              {entry.iconPair[1]}
            </motion.span>
          </div>
        ) : (
          <motion.span
            className="text-[52px] leading-none select-none drop-shadow-lg"
            animate={{ rotate: [0, 4, -4, 0], y: [0, -3, 0] }}
            transition={{ duration: 3.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {entry.icon}
          </motion.span>
        )}
      </div>

      {/* Bottom strip */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2.5 z-10"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}
      >
        <p className="text-white font-black text-[13px] leading-snug line-clamp-1">{entry.title}</p>
        {/* Always show progress bar so card height stays consistent */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
            {!isNew && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: index * 0.05 + 0.2 }}
                className="h-full rounded-full bg-white"
              />
            )}
          </div>
          <span className="text-white/70 font-bold text-[10px] w-7 text-right">
            {isNew ? 'NEW' : `${pct}%`}
          </span>
        </div>
      </div>
    </motion.button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const KidsModuleLandingPage: React.FC<KidsModuleLandingPageProps> = ({
  moduleTitle,
  moduleEmoji,
  headerGradient = 'from-violet-500 to-indigo-600',
  bgColor = '#f5f5f7',
  games,
  footer,
  pageSize,
  onBack,
}) => {
  const navigate      = useNavigate();
  const [page, setPage] = useState(0);
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});

  // Dynamic page size — fills device height, no empty space at bottom
  const autoPageSize = useMemo(() => {
    if (pageSize !== undefined) return pageSize;
    const available = window.innerHeight - 160; // header + pagination
    const rows = Math.max(2, Math.min(6, Math.floor(available / CARD_HEIGHT)));
    return rows * 2; // 2-column grid
  }, [pageSize]);

  // Effective header gradient: user accent overrides module default (reactive)
  const [effectiveGradient, setEffectiveGradient] = useState<string>(() => {
    const id = localStorage.getItem('kids_accent_color');
    return id && ACCENT_MAP[id] ? ACCENT_MAP[id] : headerGradient;
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setEffectiveGradient(id && ACCENT_MAP[id] ? ACCENT_MAP[id] : headerGradient);
    };
    window.addEventListener('kids-accent-change', handler);
    return () => window.removeEventListener('kids-accent-change', handler);
  }, [headerGradient]);

  const totalPages = Math.ceil(games.length / autoPageSize);

  // Load progress for all games
  useEffect(() => {
    const map: Record<string, ModuleProgress> = {};
    games.forEach(g => {
      map[g.id] = getProgress(g.id, g.totalScenarios ?? 8);
    });
    setProgressMap(map);
  }, [games]);

  const pageItems = useMemo(() => {
    const start = page * autoPageSize;
    return games.slice(start, start + autoPageSize);
  }, [page, games, autoPageSize]);

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    navigate(-1);
  };

  const navPath = (path: string) => {
    navigate(path, { state: { fromProfileSelection: true } });
  };

  return (
    <div 
      className="w-full min-h-screen flex flex-col relative overflow-hidden select-none"
      style={{ backgroundColor: bgColor }}
    >
      <Watermarks emoji={moduleEmoji} />

      {/* ── Header ── */}
      <div className={`relative z-10 w-full bg-gradient-to-br ${effectiveGradient} pb-5 pt-safe`}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          {/* Back button — always visible */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center text-white shadow-md shrink-0"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </motion.button>

          {/* Module identity */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-3xl leading-none">{moduleEmoji}</span>
            <div className="min-w-0">
              <p className="text-white font-black text-xl leading-tight tracking-tight">{moduleTitle}</p>
              <p className="text-white/70 text-[11px] font-bold">{games.length} activities</p>
            </div>
          </div>

          {/* Page counter chip */}
          <div className="bg-white/20 px-3 py-1.5 rounded-2xl shrink-0">
            <span className="text-white font-black text-sm">{page + 1}/{totalPages}</span>
          </div>
        </div>
      </div>

      {/* ── Game Grid ── */}
      <div className="flex-1 relative z-10 px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="grid grid-cols-2 gap-3"
          >
            {pageItems.map((entry, idx) => (
              <GameCard
                key={entry.id}
                entry={entry}
                progress={progressMap[entry.id] ?? null}
                index={idx}
                onTap={() => navPath(entry.path)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Pagination Controls ── */}
        <div className="flex items-center justify-center gap-3 mt-5 mb-4">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition-all ${
              page === 0 ? 'bg-gray-200 dark:bg-[#3a3a3c] opacity-40' : 'bg-white dark:bg-[#2c2c2e] text-gray-700 dark:text-gray-200'
            }`}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </motion.button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setPage(i)}
                animate={{ scale: page === i ? 1.4 : 1 }}
                className={`w-2 h-2 rounded-full transition-colors bg-gradient-to-r ${
                  page === i ? `${effectiveGradient} scale-125` : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow transition-all ${
              page === totalPages - 1 ? 'bg-gray-200 dark:bg-[#3a3a3c] opacity-40' : 'bg-white dark:bg-[#2c2c2e] text-gray-700 dark:text-gray-200'
            }`}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </motion.button>
        </div>

        {footer && <div className="mt-2">{footer}</div>}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default KidsModuleLandingPage;
