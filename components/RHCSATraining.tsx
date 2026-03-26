import { RHCSA_LABS } from "@/lib/constants";

type Props = {
  completedLabs: string[];
  onStartLab: (title: string) => void;
  onMarkDone: (labId: string) => void;
};

export function RHCSATraining({ completedLabs, onStartLab, onMarkDone }: Props) {
  return (
    <section className="card space-y-4">
      <h2 className="text-lg font-semibold">RHCSA Training Mode</h2>
      <div className="space-y-3">
        {RHCSA_LABS.map((lab) => {
          const done = completedLabs.includes(lab.id);
          return (
            <article key={lab.id} className="rounded-lg border border-slate-700 bg-panelAlt p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{lab.title}</h3>
                <span className="text-xs text-textMuted">{done ? "Done ✅" : "Pending"}</span>
              </div>
              <p className="mb-2 text-sm"><strong>Objective:</strong> {lab.objective}</p>
              <p className="text-xs text-textMuted">Commands:</p>
              <ul className="mb-2 list-inside list-disc text-sm">
                {lab.commands.map((command) => (
                  <li key={command}><code>{command}</code></li>
                ))}
              </ul>
              <p className="mb-3 text-sm"><strong>Expected result:</strong> {lab.expectedResult}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onStartLab(lab.title)}
                  className="focus-ring rounded-lg border border-slate-600 px-3 py-1 text-sm"
                >
                  Start Lab
                </button>
                <button
                  onClick={() => onMarkDone(lab.id)}
                  className="focus-ring rounded-lg bg-accent px-3 py-1 text-sm font-semibold text-slate-900"
                >
                  Mark as Done
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
