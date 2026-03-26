import { HabitDefinition, RhcsaLab } from "@/lib/types";

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

export const XP_PER_SESSION = 20;
export const XP_PER_LAB = 35;

export const RHCSA_TASKS = [
  "Practice Linux commands in terminal for 10 minutes",
  "Complete one users & groups mini-lab",
  "Run one permissions troubleshooting drill",
  "Review systemctl workflow and service logs",
  "Practice networking basics with nmcli and firewall-cmd"
];

export const LOW_ENERGY_TASKS = [
  "Read 2 pages of Linux notes",
  "Solve one tiny coding kata",
  "Write today's top 1 priority",
  "Clean one folder in your project",
  "Review one RHCSA command family"
];

export const RHCSA_LABS: RhcsaLab[] = [
  {
    id: "permissions",
    title: "File Permissions Lab",
    objective: "Create a shared folder and enforce secure permissions for a team.",
    commands: ["mkdir -p /tmp/teamdocs", "groupadd devops", "chgrp devops /tmp/teamdocs", "chmod 2770 /tmp/teamdocs"],
    expectedResult: "Only owner/group can access the folder, and new files inherit the devops group."
  },
  {
    id: "users-groups",
    title: "Users & Groups Lab",
    objective: "Create a trainee user and assign proper group membership.",
    commands: ["useradd trainee", "passwd trainee", "groupadd linuxlab", "usermod -aG linuxlab trainee", "id trainee"],
    expectedResult: "The trainee user exists and includes linuxlab in group memberships."
  },
  {
    id: "systemctl",
    title: "systemctl Service Check",
    objective: "Inspect and manage an SSH service lifecycle.",
    commands: ["systemctl status sshd", "systemctl restart sshd", "systemctl enable sshd", "systemctl is-enabled sshd"],
    expectedResult: "sshd is running and enabled at boot."
  },
  {
    id: "networking",
    title: "Networking Basics Drill",
    objective: "Inspect interface state and open a service in firewall.",
    commands: ["ip a", "nmcli device status", "firewall-cmd --add-service=http --permanent", "firewall-cmd --reload", "firewall-cmd --list-services"],
    expectedResult: "Network interfaces are visible and firewall allows HTTP."
  }
];

export const LEVELS = [
  { label: "Beginner", minXp: 0 },
  { label: "Junior Admin", minXp: 120 },
  { label: "SysAdmin", minXp: 260 },
  { label: "RHCSA Ready", minXp: 450 }
] as const;
