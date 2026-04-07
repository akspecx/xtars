/**
 * kids-ui/useSound.ts
 * Lightweight Web Audio API tones for correct / wrong feedback.
 */
import { useRef, useCallback } from 'react';

export function useSound(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback(
    (freq: number, dur = 0.2) => {
      if (muted) return;
      try {
        if (!ctxRef.current)
          ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const ctx = ctxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + dur);
      } catch { /* ignore */ }
    },
    [muted],
  );

  const ding = useCallback(() => {
    playTone(880, 0.15);
    setTimeout(() => playTone(1100, 0.15), 150);
  }, [playTone]);

  const buzz = useCallback(() => { playTone(200, 0.18); }, [playTone]);

  return { ding, buzz };
}
