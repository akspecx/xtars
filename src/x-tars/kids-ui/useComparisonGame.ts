/**
 * kids-ui/useComparisonGame.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Game-state hook for Big/Small/Tall/Short comparison modules.
 * Contains all timer, round, mode, and scoring logic.
 * Each module page uses this hook + renders its own JSX.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { recordCompletion } from '../courses/CommonUtility/useModuleProgress';
import { useSpeech }        from './useSpeech';
import { useSound }         from './useSound';
import type { GamePair, VoiceScript } from './types';

// ─── Theme tokens (light & dark wooden) ─────────────────────────────────────

export const WOOD_LIGHT = {
  pageBg:       '#F5E6D3',
  cardBg:       '#FFFDF5',
  cardBorder:   '#D4A574',
  areaRing:     '#E8C9A0',
  areaBg:       '#FFF8EE',
  text:         '#3D2008',
  textMuted:    '#8B6232',
  bubbleBg:     '#FFFCF0',
  bubbleBorder: '#D4A574',
  headerText:   '#FFFFFF',
  dot:          '#E8C9A0',
};

export const WOOD_DARK = {
  pageBg:       '#2C1A0E',
  cardBg:       '#3D2410',
  cardBorder:   '#7B5533',
  areaRing:     '#5C3319',
  areaBg:       '#3A2010',
  text:         '#F5DFB8',
  textMuted:    '#D4A574',
  bubbleBg:     '#3D2810',
  bubbleBorder: '#7B5533',
  headerText:   '#FFFFFF',
  dot:          '#5C3319',
};

export type WoodTheme = typeof WOOD_LIGHT;

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameMode = 'play' | 'practice';
export type Phase    = 'question' | 'correct' | 'wrong';

const ROUNDS   = 5;
const MODE_KEY = 'kids_game_mode';
const getMode  = (): GameMode => { try { return (localStorage.getItem(MODE_KEY) as GameMode) || 'play'; } catch { return 'play'; } };
const saveMode = (m: GameMode) => { try { localStorage.setItem(MODE_KEY, m); } catch { /**/ } };

export interface UseComparisonGameOptions {
  moduleId:       string;
  target:         'primary' | 'secondary' | 'mix';
  primaryLabel:   string;
  secondaryLabel: string;
  pairs:          GamePair[];
  voice:          VoiceScript;
  kidName:        string;
}

export function useComparisonGame({
  moduleId, target, primaryLabel, secondaryLabel, pairs, voice, kidName,
}: UseComparisonGameOptions) {
  const sessionPairs = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).slice(0, Math.min(ROUNDS, pairs.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [mode,          setMode]          = useState<GameMode>(getMode);
  const [pairIdx,       setPairIdx]       = useState(0);
  const [askPrimary,    setAskPrimary]    = useState(target !== 'secondary');
  const [leftIsPrimary, setLeftIsPrimary] = useState(true);
  const [phase,         setPhase]         = useState<Phase>('question');
  const [selected,      setSelected]      = useState<'left' | 'right' | null>(null);
  const [isMuted,       setIsMuted]       = useState(false);
  const [score,         setScore]         = useState(0);
  const [showConcept,   setShowConcept]   = useState(false);
  const [shownConcept,  setShownConcept]  = useState(false);
  const [celebrating,   setCelebrating]   = useState(false);
  const [pointer,       setPointer]       = useState<{ x: number; y: number } | null>(null);
  const [done,          setDone]          = useState(false);

  const { speak, cancel } = useSpeech(isMuted);
  const { ding, buzz }    = useSound(isMuted);

  const leftRef  = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playRef  = useRef(false);

  const pair = sessionPairs[pairIdx];

  const resolvedAskPrimary = useMemo(() => {
    if (target === 'primary')   return true;
    if (target === 'secondary') return false;
    return askPrimary;
  }, [target, askPrimary]);

  const correctSide = useMemo<'left' | 'right'>(
    () => (leftIsPrimary
      ? (resolvedAskPrimary ? 'left' : 'right')
      : (resolvedAskPrimary ? 'right' : 'left')),
    [leftIsPrimary, resolvedAskPrimary],
  );

  const leftSide   = leftIsPrimary ? pair.primary   : pair.secondary;
  const rightSide  = leftIsPrimary ? pair.secondary : pair.primary;
  const correctObj = resolvedAskPrimary ? pair.primary   : pair.secondary;
  const askLabel   = resolvedAskPrimary ? primaryLabel   : secondaryLabel;

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const after = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms); timers.current.push(t);
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPointer(null);
    setCelebrating(false);
    playRef.current = false;
    cancel();
  }, [cancel]);

  // ── Reset round ─────────────────────────────────────────────────────────────
  const resetRound = useCallback((idx: number, nextAP?: boolean) => {
    clearAll();
    setPairIdx(idx);
    const ap = nextAP !== undefined
      ? nextAP
      : (target === 'secondary' ? false : target === 'primary' ? true : Math.random() < 0.5);
    setAskPrimary(ap);
    setLeftIsPrimary(Math.random() < 0.5);
    setPhase('question');
    setSelected(null);
    setShowConcept(false);
  }, [clearAll, target]);

  // ── Answer ──────────────────────────────────────────────────────────────────
  const handleAnswer = useCallback((side: 'left' | 'right') => {
    if (phase !== 'question') return;
    setSelected(side);
    const isRight = side === correctSide;
    if (isRight) {
      setPhase('correct');
      setScore(s => { const ns = s + 1; recordCompletion(moduleId, sessionPairs.length, ns); return ns; });
      ding();
      speak(voice.correct(correctObj.name, askLabel, kidName));
      setCelebrating(true);
      after(1700, () => setCelebrating(false));
      after(2300, () => {
        if (!shownConcept) {
          setShownConcept(true);
          setShowConcept(true);
        } else {
          const next = pairIdx + 1;
          if (next < sessionPairs.length) resetRound(next);
          else { setDone(true); speak(voice.done(kidName)); }
        }
      });
    } else {
      setPhase('wrong');
      buzz();
      speak(voice.wrong(askLabel));
      after(2000, () => { setPhase('question'); setSelected(null); });
    }
  }, [phase, correctSide, ding, buzz, speak, voice, correctObj, askLabel, kidName,
      shownConcept, pairIdx, after, resetRound, moduleId, sessionPairs.length]);

  // ── Concept done ─────────────────────────────────────────────────────────────
  const onConceptDone = useCallback(() => {
    setShowConcept(false);
    const next = pairIdx + 1;
    if (next < sessionPairs.length) resetRound(next);
    else { setDone(true); speak(voice.done(kidName)); }
  }, [pairIdx, resetRound, speak, voice, kidName, sessionPairs.length]);

  // ── Play mode automation ─────────────────────────────────────────────────────
  const runPlayMode = useCallback(async () => {
    if (playRef.current) return;
    playRef.current = true;
    await new Promise<void>(r => after(600, r));
    speak(voice.question(askLabel, kidName));
    await new Promise<void>(r => after(2000, r));
    const wrongEl = (correctSide === 'left' ? rightRef : leftRef).current;
    if (wrongEl) { const r = wrongEl.getBoundingClientRect(); setPointer({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }
    speak(voice.playWrong(askLabel));
    await new Promise<void>(r => after(1800, r));
    speak(voice.playThink());
    await new Promise<void>(r => after(1500, r));
    const correctEl = (correctSide === 'left' ? leftRef : rightRef).current;
    if (correctEl) { const r = correctEl.getBoundingClientRect(); setPointer({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }
    speak(voice.playCorrect(correctObj.name, askLabel));
    await new Promise<void>(r => after(950, r));
    setPointer(null);
    await new Promise<void>(r => after(300, r));
    handleAnswer(correctSide);
    playRef.current = false;
  }, [after, speak, voice, correctSide, correctObj, askLabel, kidName, handleAnswer]);

  // Trigger play mode on new question
  useEffect(() => {
    if (mode === 'play' && phase === 'question') {
      const t = setTimeout(runPlayMode, 800);
      return () => clearTimeout(t);
    }
  }, [mode, phase, pairIdx, runPlayMode]);

  // Intro
  useEffect(() => {
    resetRound(0, target !== 'secondary');
    after(500, () => speak(voice.intro(primaryLabel, secondaryLabel, kidName)));
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mode switch ──────────────────────────────────────────────────────────────
  const switchMode = useCallback((m: GameMode) => {
    clearAll(); setMode(m); saveMode(m); setScore(0); setShownConcept(false);
    resetRound(0, target !== 'secondary');
    after(400, () => speak(
      m === 'play' ? `Watch me, ${kidName}!` : `Your turn, ${kidName}!`,
    ));
  }, [clearAll, resetRound, after, speak, kidName, target]);

  // ── Replay ───────────────────────────────────────────────────────────────────
  const replay = useCallback(() => {
    clearAll(); setScore(0); setShownConcept(false); setDone(false);
    resetRound(0, target !== 'secondary');
  }, [clearAll, resetRound, target]);

  return {
    // data
    pair, sessionPairs, pairIdx, score,
    // sides
    leftSide, rightSide, leftRef, rightRef, correctSide, correctObj, askLabel,
    resolvedAskPrimary,
    // phase & state
    mode, phase, selected, isMuted, celebrating, pointer, showConcept, done,
    // actions
    handleAnswer, onConceptDone, switchMode, replay,
    setIsMuted: (v: boolean) => { setIsMuted(v); if (v) cancel(); },
    setShowConcept,
    speak,
  };
}
