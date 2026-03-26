import { LEVELS } from "@/lib/constants";

function getLevel(xp: number) {
  return [...LEVELS].reverse().find((level) => xp >= level.minXp) ?? LEVELS[0];
}

type Props = {
  xp: number;
};

export function XPBadge({ xp }: Props) {
  const level = getLevel(xp);
  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">Streak + XP</h2>
      <p className="text-sm text-textMuted">Level: {level.label}</p>
      <p className="text-2xl font-bold">{xp} XP</p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.min(100, (xp / 450) * 100)}%` }} />
      </div>
    </section>
  );
}
