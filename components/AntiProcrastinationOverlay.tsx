type Props = {
  visible: boolean;
  task: string;
  timerLabel: string;
  progress: number;
  onExit: () => void;
};

export function AntiProcrastinationOverlay({ visible, task, timerLabel, progress, onExit }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center gap-8 bg-bg px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-textMuted">Anti-Procrastination Mode</p>
      <p className="text-7xl font-bold">{timerLabel}</p>
      <p className="max-w-xl text-2xl font-semibold">{task}</p>
      <div className="h-3 w-full max-w-2xl overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-lg text-textMuted">Just start. 5 minutes is enough.</p>
      <button className="focus-ring rounded-lg border border-slate-700 px-4 py-2" onClick={onExit}>
        Exit Fullscreen
      </button>
    </div>
  );
}
