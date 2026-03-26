# FocusForge

FocusForge is a minimal **Linux Learning Companion + Focus System** built with Next.js, Tailwind, and localStorage.

## What’s included
- Pomodoro deep work timer (25/5) with progress and fullscreen anti-procrastination mode
- Track selection before session: Linux Practice / Coding / Study
- Habit tracker (5 fixed habits) with streak + weekly completion
- Daily dashboard + distraction reset + low energy mode
- **AI Linux Coach chat** (Explain / Give Task / Quiz Me)
- **RHCSA Training Mode** with structured labs and mark-as-done flow
- **Smart Practice Generator** (`Generate Practice`)
- **AI Session Summary** after completed focus sessions
- **XP + Level system** (Beginner → RHCSA Ready)
- Simple frontend **Terminal Simulation** (`ls`, `cd`, `mkdir`, `pwd`)
- Focus audio: gentle lofi pulse on focus start + alarm at focus completion
- Space shortcut is disabled while typing in input/textarea fields (AI chat safe)

## Stack
- Next.js App Router
- Tailwind CSS
- Local storage persistence
- Next.js API routes for AI endpoints

## API routes
- `POST /api/coach`
- `POST /api/generate-practice`
- `POST /api/session-summary`

## OpenAI setup (optional)
If no API key is present, FocusForge uses built-in **mock mode**.

1. Create `.env.local`:
   ```bash
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-4.1-mini
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Run locally:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Example prompts used
- "Explain chmod with one practical example."
- "Give me one RHCSA beginner task I can do in 10 minutes."
- "Quiz me on basic Linux commands with 3 quick questions."

## Updated structure
```
app/
  api/
    coach/route.ts
    generate-practice/route.ts
    session-summary/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  AICoachPanel.tsx
  AntiProcrastinationOverlay.tsx
  Dashboard.tsx
  DeepWorkTimer.tsx
  HabitTracker.tsx
  RHCSAMode.tsx
  RHCSATraining.tsx
  TerminalSim.tsx
  XPBadge.tsx
hooks/
  usePersistentState.ts
lib/
  constants.ts
  storage.ts
  types.ts
```
