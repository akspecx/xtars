/**
 * AlphabetLearningHub.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Landing hub for the structured alphabet learning path.
 * Shows:
 *   1. "World Around Us" card → DailyObjectsModule
 *   2. A-Z letter tiles → each goes to that letter's intro
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { K } from '../../../../../kids-ui/KidsGameShell';
import { ALPHABET_DATA } from '../alphabetData';

const AlphabetLearningHub: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const kidAvatar = activeProfile?.avatar ?? 'bird';
  const kidName   = activeProfile?.name   ?? 'Explorer';

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: K.bg }}
    >
      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 shadow-md"
        style={{
          paddingTop: 'env(safe-area-inset-top,14px)', paddingBottom: 10,
          background: K.topBar, borderBottom: `2.5px solid ${K.container}`,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate('/games/alphabets')}
          className="h-10 w-10 flex items-center justify-center rounded-xl shadow-md shrink-0"
          style={{ background: K.container, border: `1.5px solid ${K.surfaceVar}` }}
        >
          <ChevronLeft size={22} color={K.onSurface} strokeWidth={3} />
        </motion.button>

        <p className="flex-1 font-black text-lg text-center" style={{ color: K.onSurface }}>
          Alphabet Learning
        </p>

        <div className="h-10 w-10 rounded-xl overflow-hidden shadow-md shrink-0"
          style={{ border: `2.5px solid ${K.container}`, background: '#fff' }}>
          <KidAvatar avatar={kidAvatar} size={36} />
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="px-5 py-5" style={{ background: K.topBar, borderBottom: `1.5px solid ${K.container}` }}>
        <span className="px-3 py-1 rounded-full font-black text-sm"
          style={{ background: K.active, color: K.onSurface }}>
          ✨ Learn with {kidName}!
        </span>
        <h1 className="font-black mt-2 leading-tight" style={{ fontSize: 28, color: K.onSurface }}>
          Start your A-B-C journey!
        </h1>
      </div>

      <div className="flex-1 px-4 py-5 pb-24 space-y-6">

        {/* ── Step 1: Daily objects ── */}
        <section>
          <p className="font-black text-base mb-3" style={{ color: K.onSurface }}>
            Step 1 · World Around Us 🌍
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/games/alphabets/daily-objects')}
            className="w-full rounded-3xl overflow-hidden shadow-xl flex items-center gap-4 px-5 py-5"
            style={{ background: 'linear-gradient(135deg,#fff,#fff9e0)', border: `3px solid ${K.container}` }}
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl text-6xl shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#fbeb5b,#f0e037)' }}>
              🌍
            </div>
            <div className="text-left">
              <p className="font-black text-xl" style={{ color: K.onSurface }}>Daily Objects</p>
              <p className="font-bold text-sm mt-1" style={{ color: K.onSurfaceVar }}>
                Fan · Moon · Apple · Car…
              </p>
              <span className="mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-black"
                style={{ background: K.active, color: K.onSurface }}>
                NEW ✨
              </span>
            </div>
          </motion.button>
        </section>

        {/* ── Step 2: A-Z letter tiles ── */}
        <section>
          <p className="font-black text-base mb-3" style={{ color: K.onSurface }}>
            Step 2 · Learn Each Letter 🔤
          </p>
          <div className="grid grid-cols-4 gap-3">
            {ALPHABET_DATA.map((d, idx) => (
              <motion.button
                key={d.letter}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => navigate(`/games/alphabets/letter-intro/${d.letter}`)}
                className="rounded-2xl flex flex-col items-center justify-center py-4 shadow-lg"
                style={{ background: d.bg, border: `3px solid ${d.color}44` }}
              >
                <span className="font-black text-3xl leading-none" style={{ color: d.color }}>
                  {d.letter}
                </span>
                <span className="font-bold text-xs mt-1" style={{ color: d.color + 'cc' }}>
                  {d.examples[0].word.slice(0,4)}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Step 3: Quiz banner ── */}
        <section>
          <p className="font-black text-base mb-3" style={{ color: K.onSurface }}>
            Step 3 · Test Yourself 🎯
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/games/alphabets/starts-with/A')}
            className="w-full rounded-3xl overflow-hidden shadow-xl flex items-center gap-4 px-5 py-5"
            style={{ background: 'linear-gradient(135deg,#fff,#f0fff4)', border: `3px solid ${K.active}` }}
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl text-6xl shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#b9f474,#7ec84a)' }}>
              🎯
            </div>
            <div className="text-left">
              <p className="font-black text-xl" style={{ color: K.onSurface }}>Starts With…</p>
              <p className="font-bold text-sm mt-1" style={{ color: K.onSurfaceVar }}>
                Tap things that start with each letter!
              </p>
            </div>
          </motion.button>
        </section>
      </div>
    </div>
  );
};

export default AlphabetLearningHub;
