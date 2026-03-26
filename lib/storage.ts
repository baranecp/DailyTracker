import { AppState } from "@/lib/types";

const STORAGE_KEY = "focusforge_state_v2";

export const defaultState: AppState = {
  currentTask: "RHCSA lab: users, groups, permissions",
  todayPlan: [
    "1 Linux deep work session",
    "1 coding block",
    "30 min gym/cardio"
  ],
  lowEnergyMode: false,
  distractionResets: 0,
  restartTimerSeconds: 0,
  sessionCountToday: 0,
  focusMinutesToday: 0,
  weeklyHabits: {},
  rhcsaMode: true,
  selectedTrack: "linux",
  xp: 0,
  completedLabs: [],
  latestSummary: ""
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;

  try {
    return { ...defaultState, ...JSON.parse(raw) } as AppState;
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - index));
    return dayKey(d);
  });
}
