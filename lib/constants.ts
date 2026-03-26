import { HabitDefinition } from "@/lib/types";

export const DEFAULT_FOCUS_SECONDS = 25 * 60;
export const DEFAULT_BREAK_SECONDS = 5 * 60;
export const RESTART_SECONDS = 5 * 60;

export const HABITS: HabitDefinition[] = [
  { key: "start_focus_session", label: "Start focus session" },
  { key: "study_linux", label: "Study Linux" },
  { key: "coding_practice", label: "Coding practice" },
  { key: "gym_cardio", label: "Gym / cardio" },
  { key: "no_social_media", label: "No social media during work block" }
];

export const RHCSA_TASKS = [
  "Practice 20 Linux commands from memory",
  "Run user and permission management lab",
  "Simulate storage + LVM setup challenge",
  "Troubleshoot systemd and logs drill",
  "Networking + firewall terminal challenge"
];

export const LOW_ENERGY_TASKS = [
  "Read 2 pages of Linux notes",
  "Solve one tiny coding kata",
  "Write today's top 1 priority",
  "Clean one folder in your project",
  "Review one RHCSA command family"
];
