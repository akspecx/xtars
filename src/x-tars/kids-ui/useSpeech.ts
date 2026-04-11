/**
 * kids-ui/useSpeech.ts
 * Uses @capacitor-community/text-to-speech for native Android/iOS TTS.
 * Falls back to Web Speech API in the browser.
 */
import { useCallback } from 'react';

// Try to resolve the Capacitor TTS plugin at runtime (not available in browser)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let CapTTS: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CapTTS = require('@capacitor-community/text-to-speech').TextToSpeech;
} catch { /* browser environment — plugin not bundled */ }

const isNative = (): boolean => {
  try { return (window as any).Capacitor?.isNativePlatform?.() === true; }
  catch { return false; }
};

async function nativeSpeak(text: string, rate: number, pitch: number) {
  if (!CapTTS) return;
  try {
    await CapTTS.stop();
    await CapTTS.speak({ text, lang: 'en-US', rate, pitch, volume: 1.0, category: 'ambient' });
  } catch { /* ignore TTS errors */ }
}

function webSpeak(text: string, rate: number, pitch: number) {
  if (!('speechSynthesis' in window)) return;
  try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
  const go = () => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate; u.pitch = pitch; u.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const pick = voices.find(v => v.lang.startsWith('en')) ?? voices[0];
      if (pick) u.voice = pick;
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  };
  if (window.speechSynthesis.getVoices().length > 0) {
    go();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; go(); };
  }
}

export function useSpeech(muted: boolean) {
  const speak = useCallback(
    (text: string, rate = 0.88, pitch = 1.25) => {
      if (muted) return;
      try {
        const saved = localStorage.getItem('speechEnabled');
        if (saved === 'false') return;
      } catch { /* ignore */ }
      if (isNative()) { nativeSpeak(text, rate, pitch); }
      else { webSpeak(text, rate, pitch); }
    },
    [muted],
  );

  const cancel = useCallback(() => {
    if (isNative()) { try { CapTTS?.stop(); } catch { /* ignore */ } }
    else { try { window.speechSynthesis?.cancel(); } catch { /* ignore */ } }
  }, []);

  return { speak, cancel };
}
