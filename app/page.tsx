"use client";

import { useEffect, useMemo, useState } from "react";
import { AntiProcrastinationOverlay } from "@/components/AntiProcrastinationOverlay";
import { Dashboard } from "@/components/Dashboard";
import { DeepWorkTimer } from "@/components/DeepWorkTimer";
import { HabitTracker } from "@/components/HabitTracker";
import { RHCSAMode } from "@/components/RHCSAMode";
import { DEFAULT_BREAK_SECONDS, DEFAULT_FOCUS_SECONDS, HABITS, LOW_ENERGY_TASKS, RESTART_SECONDS } from "@/lib/constants";
import { dayKey, defaultState, getLast7Days, loadState, saveState } from "@/lib/storage";
import { FocusMode, HabitKey } from "@/lib/types";

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [appState, setAppState] = useState(defaultState);
  const [mode, setMode] = useState<FocusMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_FOCUS_SECONDS);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const today = dayKey();

  useEffect(() => {
    const stored = loadState();
    setAppState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(appState);
  }, [appState, hydrated]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (mode === "focus") {
            setAppState((s) => ({
              ...s,
              sessionCountToday: s.sessionCountToday + 1,
              focusMinutesToday: s.focusMinutesToday + DEFAULT_FOCUS_SECONDS / 60
            }));
            setMode("break");
            return DEFAULT_BREAK_SECONDS;
          }

          setMode("focus");
          return DEFAULT_FOCUS_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === " ") {
        event.preventDefault();
        setIsRunning((v) => !v);
      }
      if (event.key.toLowerCase() === "d") {
        handleDistraction();
      }
      if (event.key.toLowerCase() === "l") {
        toggleLowEnergyMode();
      }
      if (event.key.toLowerCase() === "f") {
        void enterFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const weeklyHabits = useMemo(() => {
    const base = { ...appState.weeklyHabits };
    getLast7Days().forEach((d) => {
      if (!base[d]) base[d] = [];
    });
    return base;
  }, [appState.weeklyHabits]);

  const todayHabits = weeklyHabits[today] ?? [];

  const completionRate = useMemo(() => {
    const days = Object.keys(weeklyHabits);
    const totalDone = days.reduce((sum, day) => sum + (weeklyHabits[day]?.length ?? 0), 0);
    const totalPossible = days.length * HABITS.length;
    return Math.round((totalDone / Math.max(1, totalPossible)) * 100);
  }, [weeklyHabits]);

  const streak = useMemo(() => {
    const days = getLast7Days().reverse();
    let current = 0;
    for (const day of days) {
      if ((weeklyHabits[day] ?? []).length > 0) current += 1;
      else break;
    }
    return current;
  }, [weeklyHabits]);

  const progress = Math.round(
    ((mode === "focus" ? DEFAULT_FOCUS_SECONDS : DEFAULT_BREAK_SECONDS) - secondsLeft) /
      (mode === "focus" ? DEFAULT_FOCUS_SECONDS : DEFAULT_BREAK_SECONDS) *
      100
  );

  const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

  const markHabit = (habit: HabitKey) => {
    setAppState((prev) => {
      const current = prev.weeklyHabits[today] ?? [];
      const exists = current.includes(habit);
      const updated = exists ? current.filter((item) => item !== habit) : [...current, habit];

      return {
        ...prev,
        weeklyHabits: {
          ...prev.weeklyHabits,
          [today]: updated
        }
      };
    });
  };

  const startSession = async () => {
    setIsRunning(true);
    markHabit("start_focus_session");
    await enterFullscreen();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(DEFAULT_FOCUS_SECONDS);
  };

  const handleDistraction = () => {
    setAppState((prev) => ({
      ...prev,
      distractionResets: prev.distractionResets + 1,
      restartTimerSeconds: RESTART_SECONDS
    }));
  };

  useEffect(() => {
    if (appState.restartTimerSeconds <= 0) return;

    const id = window.setInterval(() => {
      setAppState((prev) => ({
        ...prev,
        restartTimerSeconds: Math.max(0, prev.restartTimerSeconds - 1)
      }));
    }, 1000);

    return () => window.clearInterval(id);
  }, [appState.restartTimerSeconds]);

  const toggleLowEnergyMode = () => {
    setAppState((prev) => ({
      ...prev,
      lowEnergyMode: !prev.lowEnergyMode,
      todayPlan: !prev.lowEnergyMode ? LOW_ENERGY_TASKS.slice(0, 3) : defaultState.todayPlan
    }));
  };

  const enterFullscreen = async () => {
    setFullScreenMode(true);
    if (typeof document !== "undefined" && document.fullscreenElement == null) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // ignore unsupported fullscreen
      }
    }
  };

  const exitFullscreen = async () => {
    setFullScreenMode(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  if (!hydrated) {
    return <main className="p-6 text-textMuted">Loading FocusForge...</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">FocusForge</h1>
          <p className="text-sm text-textMuted">Minimal anti-procrastination system for deep work.</p>
        </div>
        <p className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-textMuted">
          Shortcuts: [Space] start/pause · [D] distracted · [L] low energy · [F] fullscreen
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <DeepWorkTimer
          mode={mode}
          secondsLeft={secondsLeft}
          totalSeconds={mode === "focus" ? DEFAULT_FOCUS_SECONDS : DEFAULT_BREAK_SECONDS}
          isRunning={isRunning}
          sessionsToday={appState.sessionCountToday}
          onStart={startSession}
          onPause={() => setIsRunning(false)}
          onReset={resetTimer}
        />

        <Dashboard
          todayPlan={appState.todayPlan}
          sessionsCompleted={appState.sessionCountToday}
          habitsCompleted={todayHabits.length}
          focusHours={appState.focusMinutesToday / 60}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <HabitTracker
          todayHabits={todayHabits}
          weeklyHabits={weeklyHabits}
          onToggleHabit={markHabit}
          completionRate={completionRate}
          streak={streak}
        />

        <section className="card space-y-4">
          <h2 className="text-lg font-semibold">Recovery Controls</h2>

          <button
            onClick={handleDistraction}
            className="focus-ring w-full rounded-lg bg-danger/90 px-4 py-2 font-semibold"
          >
            I got distracted
          </button>

          {appState.restartTimerSeconds > 0 && (
            <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-sm">
              Reset. Start again. Small steps. Restart window: {Math.ceil(appState.restartTimerSeconds / 60)}m
            </p>
          )}

          <button
            onClick={toggleLowEnergyMode}
            className="focus-ring w-full rounded-lg border border-slate-700 px-4 py-2"
          >
            {appState.lowEnergyMode ? "Disable low energy mode" : "Low energy today"}
          </button>

          {appState.lowEnergyMode && (
            <p className="text-sm text-textMuted">
              Mode enabled: only 5-minute tasks and easy wins are shown in today's plan.
            </p>
          )}
        </section>
      </div>

      <RHCSAMode
        enabled={appState.rhcsaMode}
        onToggle={() => setAppState((prev) => ({ ...prev, rhcsaMode: !prev.rhcsaMode }))}
      />

      <AntiProcrastinationOverlay
        visible={fullScreenMode}
        task={appState.currentTask}
        timerLabel={timerLabel}
        progress={progress}
        onExit={() => void exitFullscreen()}
      />
    </main>
  );
}
