/**
 * kids-ui/useSpeech.ts
 * Thin wrapper around Web Speech API.
 */
import { useCallback } from 'react';
import { patchSpeechSynthesis } from '../../utils/patchSpeechSynthesis';

try { patchSpeechSynthesis(); } catch { /* unavailable */ }

export function useSpeech(muted: boolean) {
  const speak = useCallback(
    (text: string, rate = 0.88, pitch = 1.25) => {
      if (muted || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const go = () => {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = rate; u.pitch = pitch; u.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const pick = voices.find(v => v.lang.startsWith('en')) ?? voices[0];
        if (pick) u.voice = pick;
        window.speechSynthesis.speak(u);
      };
      if (window.speechSynthesis.getVoices().length > 0) {
        go();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          go();
        };
      }
    },
    [muted],
  );

  const cancel = useCallback(() => {
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
  }, []);

  return { speak, cancel };
}
