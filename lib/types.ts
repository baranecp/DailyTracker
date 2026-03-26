export type HabitKey =
  | "start_focus_session"
  | "study_linux"
  | "coding_practice"
  | "gym_cardio"
  | "no_social_media";

export type HabitDefinition = {
  key: HabitKey;
  label: string;
};

export type FocusMode = "focus" | "break";

export type DailyStats = {
  date: string;
  sessionsCompleted: number;
  focusMinutes: number;
  habitsCompleted: HabitKey[];
};

export type AppState = {
  currentTask: string;
  todayPlan: string[];
  lowEnergyMode: boolean;
  distractionResets: number;
  restartTimerSeconds: number;
  sessionCountToday: number;
  focusMinutesToday: number;
  weeklyHabits: Record<string, HabitKey[]>;
  rhcsaMode: boolean;
};
