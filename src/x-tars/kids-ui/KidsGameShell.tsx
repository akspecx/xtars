/**
 * kids-ui/KidsGameShell.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Universal full-screen shell for ALL kids game/learning modules.
 * Enforces the yellow Figma design language: top bar, mode toggle, progress
 * dots, and a bottom avatar+speech-bubble row identical to UnderstandingOfBig.
 *
 * Usage:
 *   <KidsGameShell title="…" accent="#005f99" onBack={…}
 *     mode={mode} onModeToggle={…}
 *     isMuted={…} onMuteToggle={…}
 *     kidAvatar={…} kidName={…} bubbleText="…" celebrating={…}
 *     dots={{ total: 5, current: 2 }}>
 *     {... page-specific content ...}
 *   </KidsGameShell>
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import KidAvatar from '../courses/CommonUtility/KidAvatar';

// ─── Shared design tokens ─────────────────────────────────────────────────────
export const K = {
  bg:            'linear-gradient(160deg,#fff7cc 0%,#fbeb5b 40%,#f6e54a 80%,#f0e037 100%)',
  topBar:        '#fff394',
  container:     '#fbeb5b',
  surfaceVar:    '#f0e037',
  active:        '#b9f474',
  primary:       '#005f99',
  primaryShadow: '#005386',
  onSurface:     '#342f00',
  onSurfaceVar:  '#655d00',
  pink:          '#ff8eaf',
} as const;

export type KidsMode = 'kid' | 'practice';

export interface KidsGameShellProps {
  title:         string;
  /** Accent colour for dots, mode pills, highlights */
  accent?:       string;
  onBack:        () => void;
  mode:          KidsMode;
  onModeToggle:  () => void;
  isMuted:       boolean;
  onMuteToggle:  () => void;
  kidAvatar:     string;
  kidName:       string;
  /** Text shown in the bottom speech bubble */
  bubbleText:    string;
  celebrating?:  boolean;
  /** When provided renders a progress dot strip below the top bar */
  dots?:         { total: number; current: number };
  children:      React.ReactNode;
}

const KidsGameShell: React.FC<KidsGameShellProps> = ({
  title, accent = K.primary, onBack,
  mode, onModeToggle, isMuted, onMuteToggle,
  kidAvatar, bubbleText, celebrating = false,
  dots, children,
}) => {
  return (
    <div
      className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: K.bg }}
    >
      {/* ── light-ray overlay ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[18, 52, 80].map((left, i) => (
          <div key={i} className="absolute top-0 w-[2px] opacity-[0.07]"
            style={{ left: `${left}%`, height: '55%',
              background: 'linear-gradient(to bottom,#342f00,transparent)',
              transform: `rotate(${(i-1)*8}deg)`, transformOrigin:'top' }} />
        ))}
      </div>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex-none"
        style={{ background: K.topBar, borderBottom: `2.5px solid ${K.container}` }}
      >
        {/* Row 1: back + title + mute */}
        <div
          className="flex items-center gap-3 px-4"
          style={{ paddingTop: 'env(safe-area-inset-top,14px)', paddingBottom: 6 }}
        >
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onBack}
            className="h-10 w-10 flex items-center justify-center rounded-xl shadow-md shrink-0"
            style={{ background: K.container, border: `1.5px solid ${K.surfaceVar}` }}
          >
            <ChevronLeft size={22} color={K.onSurface} strokeWidth={3} />
          </motion.button>

          <p className="flex-1 font-black text-lg text-center tracking-tight"
            style={{ color: K.onSurface }}>
            {title}
          </p>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={onMuteToggle}
            className="h-10 w-10 flex items-center justify-center rounded-xl shadow-md shrink-0"
            style={{ background: K.container, border: `1.5px solid ${K.surfaceVar}` }}
          >
            {isMuted
              ? <VolumeX size={20} color={K.onSurface} />
              : <Volume2 size={20} color={K.onSurface} />}
          </motion.button>
        </div>

        {/* Row 2: mode toggle pills */}
        <div className="flex items-center justify-center gap-3 pb-2 px-4">
          {(['kid', 'practice'] as KidsMode[]).map(m => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.94 }}
              onClick={onModeToggle}
              className="flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black shadow-sm"
              style={{
                background: mode === m ? accent : K.container,
                color:      mode === m ? '#fff'  : K.onSurface,
                border:     mode === m ? 'none'  : `1.5px solid ${K.surfaceVar}`,
              }}
            >
              {m === 'kid' ? '🤖 Kid Mode' : '✏️ Practice'}
              {mode === m && ' ✓'}
            </motion.button>
          ))}
        </div>

        {/* Row 3: progress dots (optional) */}
        {dots && (
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {Array.from({ length: dots.total }, (_, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === dots.current ? 1.3 : 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-full"
                style={{
                  width:      i === dots.current ? 16 : 10,
                  height:     10,
                  background: i < dots.current ? accent
                            : i === dots.current ? accent
                            : `${accent}44`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content area ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {children}
      </div>

      {/* ── Bottom avatar + speech bubble ────────────────────────────── */}
      <div
        className="relative z-10 flex-none flex items-end gap-3 px-4"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom,16px)',
          paddingTop: 8,
          background: `${K.topBar}ee`,
          borderTop: `2px solid ${K.container}`,
        }}
      >
        {/* Avatar */}
        <motion.div
          key={celebrating ? 'cel' : 'idle'}
          animate={
            celebrating
              ? { y:[0,-22,0,-14,0], rotate:[0,-8,8,-4,0], scale:[1,1.15,1] }
              : { y:[0,-5,0] }
          }
          transition={
            celebrating
              ? { duration: 0.9, ease:'easeOut' }
              : { duration: 2.2, repeat:Infinity, ease:'easeInOut' }
          }
          className="w-[68px] h-[68px] rounded-2xl overflow-hidden shadow-lg shrink-0 flex items-center justify-center"
          style={{ background: K.container, border: `2.5px solid ${K.surfaceVar}` }}
        >
          <KidAvatar avatar={kidAvatar} size={56} />
        </motion.div>

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bubbleText.slice(0, 18)}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
            transition={{ duration: 0.2 }}
            className="relative flex-1 mb-2 px-4 py-3 rounded-2xl rounded-bl-sm shadow-md"
            style={{ background:'#fff', border:`2.5px solid ${K.container}` }}
          >
            {/* left tail — border */}
            <div className="absolute left-0 bottom-4"
              style={{ transform:'translateX(-11px)', width:0, height:0,
                borderTop:'8px solid transparent', borderBottom:'8px solid transparent',
                borderRight:`12px solid ${K.container}` }} />
            {/* left tail — fill */}
            <div className="absolute left-0 bottom-4"
              style={{ transform:'translateX(-8px)', width:0, height:0,
                borderTop:'7px solid transparent', borderBottom:'7px solid transparent',
                borderRight:'11px solid white' }} />
            <p className="font-black text-base leading-snug" style={{ color: K.onSurface }}>
              {bubbleText}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KidsGameShell;
