// useModuleProgress.ts - Backend-Ready Progress Engine
// Tracks per-module progress across platforms.
// Currently uses localStorage (StorageService), but ready for API/Database plug-in.

export interface ModuleProgress {
  moduleId: string;
  visitCount: number;
  completions: number;
  totalScenarios: number;
  scenariosCompletedBest: number;
  lastPlayedTs: number | null;
  totalTimeMs: number;
  masteryLevel: 0 | 1 | 2 | 3;
}

// --- Multi-Platform Persistence Strategy ---
// To switch to a backend, simply replace this StorageService implementation
// with one that calls your API. The rest of the app will remain unchanged.

const STORAGE_KEY = (id: string) => `xtars_progress_${id}`;

const DEFAULT_PROGRESS = (moduleId: string, totalScenarios: number): ModuleProgress => ({
  moduleId,
  visitCount: 0,
  completions: 0,
  totalScenarios,
  scenariosCompletedBest: 0,
  lastPlayedTs: null,
  totalTimeMs: 0,
  masteryLevel: 0,
});

/**
 * Mastery Logic: This remains on the frontend to keep the UI snappy and responsive.
 * The backend should store the raw data, while the frontend interprets it for the UX.
 */
function computeMastery(completions: number): 0 | 1 | 2 | 3 {
  if (completions >= 5) return 3;
  if (completions >= 3) return 2;
  if (completions >= 1) return 1;
  return 0;
}

// Internal Local Storage Adaptor
const StorageService = {
  get: (moduleId: string, totalScenarios: number): ModuleProgress => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(moduleId));
      if (!raw) return DEFAULT_PROGRESS(moduleId, totalScenarios);
      return { ...DEFAULT_PROGRESS(moduleId, totalScenarios), ...JSON.parse(raw) };
    } catch {
      return DEFAULT_PROGRESS(moduleId, totalScenarios);
    }
  },
  save: (p: ModuleProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY(p.moduleId), JSON.stringify(p));
      // FUTURE: queueSyncWithServer(p);
    } catch {}
  }
};

// --- CORE ACTIONS (The "Plug-and-Play" API) ---

/**
 * Reads progress. In a backend-sync setup, this might return a cached local version
 * while fetching updates in the background.
 */
export function getProgress(moduleId: string, totalScenarios: number): ModuleProgress {
  return StorageService.get(moduleId, totalScenarios);
}

export function recordVisit(moduleId: string, totalScenarios: number): ModuleProgress {
  const p = StorageService.get(moduleId, totalScenarios);
  const updated: ModuleProgress = {
    ...p,
    visitCount: p.visitCount + 1,
    lastPlayedTs: Date.now(),
  };
  StorageService.save(updated);
  return updated;
}

export function recordCompletion(moduleId: string, totalScenarios: number, score: number): ModuleProgress {
  const p = StorageService.get(moduleId, totalScenarios);
  const newBest = Math.max(p.scenariosCompletedBest, score);
  const isNowComplete = score >= totalScenarios;
  
  const updated: ModuleProgress = {
    ...p,
    scenariosCompletedBest: newBest,
    completions: isNowComplete ? p.completions + 1 : p.completions,
    masteryLevel: computeMastery(isNowComplete ? p.completions + 1 : p.completions),
    lastPlayedTs: Date.now(),
  };
  
  StorageService.save(updated);
  return updated;
}

export function recordTime(moduleId: string, totalScenarios: number, elapsedMs: number): void {
  const p = StorageService.get(moduleId, totalScenarios);
  StorageService.save({ ...p, totalTimeMs: p.totalTimeMs + elapsedMs });
}

/**
 * Aggregates progress for a list of module IDs.
 * This is a visual-only computation and doesn't need its own storage.
 */
export function getAggregateProgress(courseId: string, moduleIds: string[]): ModuleProgress {
  let totalCompletions = 0;
  let finishedModules = 0;
  let latestTs = 0;

  moduleIds.forEach(mid => {
    const p = StorageService.get(mid, 8); 
    totalCompletions += p.completions;
    if (p.scenariosCompletedBest >= p.totalScenarios && p.totalScenarios > 0) {
      finishedModules++;
    }
    if (p.lastPlayedTs && (p.lastPlayedTs > latestTs)) latestTs = p.lastPlayedTs;
  });

  return {
    moduleId: courseId,
    totalScenarios: moduleIds.length,
    scenariosCompletedBest: finishedModules,
    completions: Math.floor(totalCompletions / Math.max(moduleIds.length, 1)),
    masteryLevel: computeMastery(finishedModules > 0 ? 1 : 0),
    visitCount: 1,
    totalTimeMs: 0,
    lastPlayedTs: latestTs,
  };
}

// --- Sync Utilities (Future Extension) ---
// When the backend is ready, implement logic to reconcile local and server states.
export async function syncProgressWithServer() {
  console.info("Syncing progress with backend... (Placeholder)");
  // 1. Fetch data from /api/progress
  // 2. Compare timestamps
  // 3. Update localStorage with server data if server is newer
  // 4. Push local changes if local is newer
}

// --- Formatting Helpers (Pure Logic) ---
export function formatLastPlayed(ts: number | null): string {
  if (!ts) return 'Never';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function formatTime(ms: number): string {
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  return `${Math.round(ms / 60000)}m`;
}

export const MASTERY_EMOJI: Record<number, string> = {
  0: '🆕',
  1: '🥉',
  2: '🥈',
  3: '🏅',
};
