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

export type SessionTrack = "linux" | "coding" | "study";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type RhcsaLab = {
  id: string;
  title: string;
  objective: string;
  commands: string[];
  expectedResult: string;
};

export type AppLevel = "Beginner" | "Junior Admin" | "SysAdmin" | "RHCSA Ready";

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
  selectedTrack: SessionTrack;
  xp: number;
  completedLabs: string[];
  latestSummary: string;
};
