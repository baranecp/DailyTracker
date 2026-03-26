import { HABITS } from "@/lib/constants";
import { HabitKey } from "@/lib/types";

type Props = {
  todayHabits: HabitKey[];
  weeklyHabits: Record<string, HabitKey[]>;
  onToggleHabit: (habit: HabitKey) => void;
  completionRate: number;
  streak: number;
};

export function HabitTracker({
  todayHabits,
  weeklyHabits,
  onToggleHabit,
  completionRate,
  streak
}: Props) {
  return (
    <section className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Habit Tracker</h2>
        <span className="text-sm text-textMuted">Streak: {streak} days</span>
      </div>

      <div className="space-y-2">
        {HABITS.map((habit) => {
          const checked = todayHabits.includes(habit.key);
          return (
            <button
              key={habit.key}
              onClick={() => onToggleHabit(habit.key)}
              className={`focus-ring flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
                checked
                  ? "border-accent bg-emerald-400/10"
                  : "border-slate-700 bg-panelAlt hover:border-slate-500"
              }`}
            >
              <span>{habit.label}</span>
              <span>{checked ? "✅" : "⬜"}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-textMuted">Weekly progress</p>
        <div className="grid grid-cols-7 gap-1">
          {Object.entries(weeklyHabits).map(([day, habits]) => (
            <div
              key={day}
              title={`${day}: ${habits.length}/${HABITS.length}`}
              className="h-8 rounded bg-slate-800"
              style={{ opacity: 0.2 + habits.length / HABITS.length }}
            />
          ))}
        </div>
        <p className="text-sm text-textMuted">Completion rate: {completionRate}%</p>
      </div>
    </section>
  );
}
