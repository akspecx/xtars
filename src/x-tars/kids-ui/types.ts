/**
 * kids-ui/types.ts
 * Shared types for all Kids game modules.
 * Lives OUTSIDE any specific course folder — reused across modules.
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

/** One comparison pair — primary is "bigger/taller/…" side */
export interface GamePair {
  primary:   { emoji: string; name: string };
  secondary: { emoji: string; name: string };
}

// ─── Voice / Message content ─────────────────────────────────────────────────

/**
 * All spoken audio lines for a module.
 * Each module page provides its own implementation so phrasing
 * stays specific to Big / Small / Tall / Short etc.
 */
export interface VoiceScript {
  /** Spoken once on mount.  e.g. "Let's find the BIG one!" */
  intro:        (primaryLabel: string, secondaryLabel: string, kidName: string) => string;
  /** Spoken at the start of each question. */
  question:     (askLabel: string, kidName: string) => string;
  /** Spoken on a correct tap. */
  correct:      (correctName: string, askLabel: string, kidName: string) => string;
  /** Spoken on a wrong tap. */
  wrong:        (askLabel: string) => string;
  /** Play-mode: spoken while hovering over the wrong card. */
  playWrong:    (askLabel: string) => string;
  /** Play-mode: "hmm, let me think…" pause line. */
  playThink:    () => string;
  /** Play-mode: spoken before tapping the correct card. */
  playCorrect:  (correctName: string, askLabel: string) => string;
  /** Spoken on completion. */
  done:         (kidName: string) => string;
  /** Spoken when the concept panel opens. */
  concept:      (askLabel: string, shownName: string, otherName: string) => string;
}

/**
 * Text shown inside the avatar speech bubble.
 * Kept SHORT — 4-7 words max — to reduce on-screen text clutter.
 */
export interface AvatarMessages {
  question: (askLabel: string) => string;
  correct:  (correctName: string) => string;
  wrong:    string;
}

