// Global patch so that all uses of window.speechSynthesis respect
// the app-wide "voice instructions" setting stored in localStorage.
//
// This means even older game modules that call window.speechSynthesis
// directly will automatically:
// - Not speak when speech is disabled in global settings
// - Still use the browser's native speech implementation when enabled
//
// Safe to call multiple times; it will only patch once.

export function patchSpeechSynthesis() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const synthesis = window.speechSynthesis as any;

  // Avoid double‑patching
  if (synthesis.__xtarsPatched) return;
  synthesis.__xtarsPatched = true;

  const originalSpeak: SpeechSynthesis["speak"] = synthesis.speak.bind(synthesis);

  synthesis.speak = (utterance: SpeechSynthesisUtterance) => {
    try {
      const saved = window.localStorage.getItem("speechEnabled");
      const enabled = saved === null ? true : saved === "true";
      if (!enabled) {
        // Voice instructions are globally disabled; swallow the call.
        return;
      }
    } catch {
      // If anything goes wrong with localStorage, fall back to speaking.
    }

    originalSpeak(utterance);
  };
}


