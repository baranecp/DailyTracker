type Props = {
  todayPlan: string[];
  sessionsCompleted: number;
  habitsCompleted: number;
  focusHours: number;
};

export function Dashboard({ todayPlan, sessionsCompleted, habitsCompleted, focusHours }: Props) {
  const planProgress = Math.round((habitsCompleted / Math.max(todayPlan.length, 1)) * 100);

  return (
    <section className="card space-y-4">
      <h2 className="text-lg font-semibold">Daily System Dashboard</h2>

      <div className="grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg bg-panelAlt p-3">Sessions: {sessionsCompleted}</div>
        <div className="rounded-lg bg-panelAlt p-3">Habits done: {habitsCompleted}</div>
        <div className="rounded-lg bg-panelAlt p-3">Focus hours: {focusHours.toFixed(1)}</div>
      </div>

      <div>
        <p className="mb-2 text-sm text-textMuted">Today's plan</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          {todayPlan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-textMuted">Progress</p>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min(100, planProgress)}%` }} />
        </div>
      </div>
    </section>
  );
}
