# FocusForge

FocusForge is a minimal, dark-mode productivity app built for anti-procrastination, deep work, and RHCSA + coding progress.

## Stack
- Next.js (App Router)
- Tailwind CSS
- LocalStorage for persistence

## Features
- Deep Work Timer (25/5 Pomodoro + progress + session counter)
- Anti-Procrastination Mode (fullscreen minimal session view)
- Habit Tracker (5 fixed habits, streak, weekly view, completion rate)
- Daily System Dashboard (today's plan, sessions, habits, focus hours)
- Distraction Reset button (`I got distracted`)
- Low Motivation Mode (`Low energy today` for easy 5-minute tasks)
- RHCSA Mode (Linux command/lab/terminal challenge suggestions)
- Keyboard shortcuts:
  - `Space` start/pause timer
  - `D` distracted reset
  - `L` low energy mode
  - `F` fullscreen

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`

## Project structure
```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  AntiProcrastinationOverlay.tsx
  Dashboard.tsx
  DeepWorkTimer.tsx
  HabitTracker.tsx
  RHCSAMode.tsx
lib/
  constants.ts
  storage.ts
  types.ts
```

## Future expansions
- Optional Node backend + auth for multi-device sync
- Site blocker integrations (browser extension or hosts-file assistant)
- Weekly review and planning flow
- Achievement system and adaptive session lengths
- RHCSA lab generator with random objectives + checklists
