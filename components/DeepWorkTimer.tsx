"use client";

import { FocusMode, SessionTrack } from "@/lib/types";

type Props = {
  mode: FocusMode;
  selectedTrack: SessionTrack;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  sessionsToday: number;
  onTrackChange: (track: SessionTrack) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

const tracks: { key: SessionTrack; label: string }[] = [
  { key: "linux", label: "Linux Practice" },
  { key: "coding", label: "Coding" },
  { key: "study", label: "Study" }
];

export function DeepWorkTimer({
  mode,
  selectedTrack,
  secondsLeft,
  totalSeconds,
  isRunning,
  sessionsToday,
  onTrackChange,
  onStart,
  onPause,
  onReset
}: Props) {
  const progress = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deep Work Timer</h2>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-sm text-textMuted">
          {mode === "focus" ? "Focus" : "Break"}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {tracks.map((track) => (
          <button
            key={track.key}
            onClick={() => onTrackChange(track.key)}
            className={`focus-ring rounded-lg border px-3 py-2 text-sm ${
              selectedTrack === track.key ? "border-accent bg-accent/10" : "border-slate-700 bg-panelAlt"
            }`}
          >
            {track.label}
          </button>
        ))}
      </div>

      <p className="text-5xl font-bold tracking-wider">{minutes}:{seconds}</p>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <button className="focus-ring rounded-lg bg-accent px-4 py-2 font-semibold text-slate-900" onClick={onStart}>
            Start Focus Session
          </button>
        ) : (
          <button className="focus-ring rounded-lg bg-slate-700 px-4 py-2" onClick={onPause}>
            Pause
          </button>
        )}
        <button className="focus-ring rounded-lg border border-slate-700 px-4 py-2" onClick={onReset}>
          Reset
        </button>
      </div>

      <p className="text-sm text-textMuted">Sessions completed today: {sessionsToday}</p>
    </section>
  );
}
