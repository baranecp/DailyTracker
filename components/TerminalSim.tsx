"use client";

import { useState } from "react";

const responses: Record<string, string> = {
  ls: "notes.txt  projects/  rhcsa-labs/",
  "cd projects": "Moved to /projects",
  "cd rhcsa-labs": "Moved to /rhcsa-labs",
  mkdir: "Directory created.",
  pwd: "/home/student"
};

export function TerminalSim() {
  const [line, setLine] = useState("");
  const [history, setHistory] = useState<string[]>(["Welcome to FocusForge Terminal Sim. Try: ls, pwd, mkdir demo"]);

  const execute = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    let output = responses[cmd];
    if (!output && cmd.startsWith("mkdir ")) output = responses.mkdir;
    if (!output) output = `command not supported: ${cmd}`;

    setHistory((prev) => [...prev, `$ ${cmd}`, output]);
    setLine("");
  };

  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">Terminal Simulation (Simple)</h2>
      <div className="h-56 overflow-y-auto rounded-lg bg-black p-3 font-mono text-sm text-green-400">
        {history.map((entry, idx) => (
          <p key={`${entry}-${idx}`}>{entry}</p>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          execute(line);
        }}
        className="flex gap-2"
      >
        <input
          value={line}
          onChange={(event) => setLine(event.target.value)}
          placeholder="Type command..."
          className="focus-ring flex-1 rounded-lg border border-slate-700 bg-panelAlt px-3 py-2 text-sm"
        />
        <button className="focus-ring rounded-lg border border-slate-600 px-3 py-2 text-sm">Run</button>
      </form>
    </section>
  );
}
