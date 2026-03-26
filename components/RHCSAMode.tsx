import { RHCSA_TASKS } from "@/lib/constants";

type Props = {
  enabled: boolean;
  onToggle: () => void;
};

export function RHCSAMode({ enabled, onToggle }: Props) {
  return (
    <section className="card space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">RHCSA Mode</h2>
        <button
          onClick={onToggle}
          className="focus-ring rounded-lg border border-slate-700 px-3 py-1 text-sm"
        >
          {enabled ? "Disable" : "Enable"}
        </button>
      </div>
      <p className="text-sm text-textMuted">
        Suggested Linux lab tasks and terminal challenges for certification prep.
      </p>
      {enabled && (
        <ul className="list-inside list-disc space-y-1 text-sm">
          {RHCSA_TASKS.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
