"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AICoachPanel } from "@/components/AICoachPanel";
import { AntiProcrastinationOverlay } from "@/components/AntiProcrastinationOverlay";
import { Dashboard } from "@/components/Dashboard";
import { DeepWorkTimer } from "@/components/DeepWorkTimer";
import { HabitTracker } from "@/components/HabitTracker";
import { RHCSAMode } from "@/components/RHCSAMode";
import { RHCSATraining } from "@/components/RHCSATraining";
import { TerminalSim } from "@/components/TerminalSim";
import { XPBadge } from "@/components/XPBadge";
import {
  DEFAULT_BREAK_SECONDS,
  DEFAULT_FOCUS_SECONDS,
  HABITS,
  LOW_ENERGY_TASKS,
  RESTART_SECONDS,
  RHCSA_TASKS,
  XP_PER_LAB,
  XP_PER_SESSION
} from "@/lib/constants";
import { dayKey, defaultState, getLast7Days, loadState, saveState } from "@/lib/storage";
import { FocusMode, HabitKey } from "@/lib/types";
import { usePersistentState } from "@/hooks/usePersistentState";

function isTypingElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}

export default function HomePage() {
  const load = useCallback(() => loadState(), []);
  const save = useCallback((value: typeof defaultState) => saveState(value), []);
  const { state, setState } = usePersistentState(load, save);

  const [mode, setMode] = useState<FocusMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_FOCUS_SECONDS);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [generatedPractice, setGeneratedPractice] = useState("");
  const [lofiOnStart, setLofiOnStart] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const lofiOscRef = useRef<OscillatorNode | null>(null);
  const lofiGainRef = useRef<GainNode | null>(null);
  const lofiPulseIntervalRef = useRef<number | null>(null);

  const appState = state ?? defaultState;
  const today = dayKey();

  const stopLofi = useCallback(() => {
    if (lofiPulseIntervalRef.current) {
      window.clearInterval(lofiPulseIntervalRef.current);
      lofiPulseIntervalRef.current = null;
    }

    lofiOscRef.current?.stop();
    lofiOscRef.current?.disconnect();
    lofiGainRef.current?.disconnect();

    lofiOscRef.current = null;
    lofiGainRef.current = null;
  }, []);

  const startLofi = useCallback(() => {
    if (lofiOscRef.current) return;

    const ctx = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = ctx;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 88;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;

    const gain = ctx.createGain();
    gain.gain.value = 0.0001;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    const pulse = () => {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.022, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);
    };

    pulse();
    lofiPulseIntervalRef.current = window.setInterval(pulse, 1200);

    lofiOscRef.current = osc;
    lofiGainRef.current = gain;
  }, []);

  const playAlarm = useCallback(() => {
    const ctx = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = ctx;

    [0, 0.22, 0.44].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(idx % 2 === 0 ? 920 : 720, ctx.currentTime + offset);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.17);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.18);
    });
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (mode === "focus") {
            setState((s) =>
              s
                ? {
                    ...s,
                    sessionCountToday: s.sessionCountToday + 1,
                    focusMinutesToday: s.focusMinutesToday + DEFAULT_FOCUS_SECONDS / 60,
                    xp: s.xp + XP_PER_SESSION
                  }
                : s
            );
            void generateSessionSummary();
            playAlarm();
            stopLofi();
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
  }, [isRunning, mode, playAlarm, setState, stopLofi]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingElement(event.target)) return;

      if (event.code === "Space") {
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

  useEffect(() => {
    return () => {
      stopLofi();
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, [stopLofi]);

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
    (((mode === "focus" ? DEFAULT_FOCUS_SECONDS : DEFAULT_BREAK_SECONDS) - secondsLeft) /
      (mode === "focus" ? DEFAULT_FOCUS_SECONDS : DEFAULT_BREAK_SECONDS)) *
      100
  );

  const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

  const markHabit = (habit: HabitKey) => {
    setState((prev) => {
      if (!prev) return prev;
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
    if (lofiOnStart) startLofi();
    await enterFullscreen();
  };

  const resetTimer = () => {
    setIsRunning(false);
    stopLofi();
    setMode("focus");
    setSecondsLeft(DEFAULT_FOCUS_SECONDS);
  };

  const handleDistraction = () => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            distractionResets: prev.distractionResets + 1,
            restartTimerSeconds: RESTART_SECONDS
          }
        : prev
    );
  };

  useEffect(() => {
    if (appState.restartTimerSeconds <= 0) return;

    const id = window.setInterval(() => {
      setState((prev) =>
        prev
          ? {
              ...prev,
              restartTimerSeconds: Math.max(0, prev.restartTimerSeconds - 1)
            }
          : prev
      );
    }, 1000);

    return () => window.clearInterval(id);
  }, [appState.restartTimerSeconds, setState]);

  const toggleLowEnergyMode = () => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            lowEnergyMode: !prev.lowEnergyMode,
            todayPlan: !prev.lowEnergyMode ? LOW_ENERGY_TASKS.slice(0, 3) : defaultState.todayPlan
          }
        : prev
    );
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

  const generatePractice = async () => {
    const res = await fetch("/api/generate-practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: "beginner" })
    });
    const data = (await res.json()) as { task: string };
    setGeneratedPractice(data.task);
  };

  const generateSessionSummary = async () => {
    const res = await fetch("/api/session-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        track: appState.selectedTrack,
        task: appState.currentTask,
        minutes: DEFAULT_FOCUS_SECONDS / 60
      })
    });
    const data = (await res.json()) as { summary: string };
    setState((prev) => (prev ? { ...prev, latestSummary: data.summary } : prev));
  };

  if (!state) {
    return <main className="p-6 text-textMuted">Loading FocusForge...</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">FocusForge</h1>
          <p className="text-sm text-textMuted">Linux Learning Companion + Focus System</p>
        </div>
        <p className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-textMuted">
          Shortcuts: [Space] start/pause · [D] distracted · [L] low energy · [F] fullscreen (disabled while typing)
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="grid gap-4 lg:grid-cols-2">
            <DeepWorkTimer
              mode={mode}
              selectedTrack={appState.selectedTrack}
              secondsLeft={secondsLeft}
              totalSeconds={mode === "focus" ? DEFAULT_FOCUS_SECONDS : DEFAULT_BREAK_SECONDS}
              isRunning={isRunning}
              sessionsToday={appState.sessionCountToday}
              onTrackChange={(track) => setState((prev) => (prev ? { ...prev, selectedTrack: track } : prev))}
              onStart={startSession}
              onPause={() => {
                setIsRunning(false);
                stopLofi();
              }}
              onReset={resetTimer}
            />

            <Dashboard
              todayPlan={appState.todayPlan}
              sessionsCompleted={appState.sessionCountToday}
              habitsCompleted={todayHabits.length}
              focusHours={appState.focusMinutesToday / 60}
            />
          </div>

          <section className="card flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Audio</h2>
              <p className="text-xs text-textMuted">Play gentle lofi pulse when focus starts + alarm at focus end.</p>
            </div>
            <button
              onClick={() => setLofiOnStart((prev) => !prev)}
              className="focus-ring rounded-lg border border-slate-700 px-3 py-2 text-sm"
            >
              {lofiOnStart ? "Lofi On" : "Lofi Off"}
            </button>
          </section>

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

              <button
                onClick={() => void generatePractice()}
                className="focus-ring w-full rounded-lg border border-cyan-500/40 px-4 py-2"
              >
                Generate Practice
              </button>

              {generatedPractice && <p className="text-sm text-cyan-200">{generatedPractice}</p>}
            </section>
          </div>

          <RHCSAMode
            enabled={appState.rhcsaMode}
            onToggle={() => setState((prev) => (prev ? { ...prev, rhcsaMode: !prev.rhcsaMode } : prev))}
          />

          <RHCSATraining
            completedLabs={appState.completedLabs}
            onStartLab={(title) => setState((prev) => (prev ? { ...prev, currentTask: title, selectedTrack: "linux" } : prev))}
            onMarkDone={(labId) =>
              setState((prev) =>
                prev
                  ? {
                      ...prev,
                      completedLabs: prev.completedLabs.includes(labId) ? prev.completedLabs : [...prev.completedLabs, labId],
                      xp: prev.completedLabs.includes(labId) ? prev.xp : prev.xp + XP_PER_LAB
                    }
                  : prev
              )
            }
          />

          <TerminalSim />
        </div>

        <div className="space-y-4">
          <XPBadge xp={appState.xp} />

          <AICoachPanel
            selectedTrack={appState.selectedTrack}
            onApplyTask={(task) => setState((prev) => (prev ? { ...prev, currentTask: task } : prev))}
          />

          {appState.selectedTrack === "linux" && (
            <section className="card space-y-2">
              <h2 className="text-lg font-semibold">Linux Focus Sidebar</h2>
              <p className="text-sm text-textMuted">Suggestions for this session:</p>
              <ul className="list-inside list-disc text-sm">
                {RHCSA_TASKS.slice(0, 3).map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </section>
          )}

          {appState.latestSummary && (
            <section className="card space-y-2">
              <h2 className="text-lg font-semibold">AI Session Summary</h2>
              <p className="whitespace-pre-wrap text-sm text-textMuted">{appState.latestSummary}</p>
            </section>
          )}
        </div>
      </div>

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
