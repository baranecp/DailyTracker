"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";

type Props = {
  selectedTrack: string;
  onApplyTask: (task: string) => void;
};

const quickPrompts = [
  { label: "Explain", prompt: "Explain chmod with one practical example." },
  { label: "Give Task", prompt: "Give me one RHCSA beginner task I can do in 10 minutes." },
  { label: "Quiz Me", prompt: "Quiz me on basic Linux commands with 3 quick questions." }
];

export function AICoachPanel({ selectedTrack, onApplyTask }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "I am your Linux Coach. Ask for commands, labs, or a mini quiz."
    }
  ]);

  const sendPrompt = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLoading(true);

    const userMessage: ChatMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, selectedTrack })
      });
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Coach is offline. Try again in mock mode or check API key setup."
        }
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <section className="card flex h-[420px] flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Linux Coach</h2>
        <span className="text-xs text-textMuted">Track: {selectedTrack}</span>
      </div>

      <div className="flex gap-2">
        {quickPrompts.map((quick) => (
          <button
            key={quick.label}
            onClick={() => void sendPrompt(quick.prompt)}
            className="focus-ring rounded-lg border border-slate-700 px-2 py-1 text-xs"
          >
            {quick.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-panelAlt p-3 text-sm">
        {messages.map((message, idx) => (
          <div
            key={`${message.role}-${idx}`}
            className={`rounded-lg p-2 ${message.role === "assistant" ? "bg-slate-800" : "bg-emerald-700/20"}`}
          >
            <p className="mb-1 text-xs uppercase text-textMuted">{message.role}</p>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.role === "assistant" && (
              <button
                onClick={() => onApplyTask(message.content.split("\n")[0])}
                className="mt-2 text-xs text-accent"
              >
                Use first line as current task
              </button>
            )}
          </div>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void sendPrompt(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Linux Coach..."
          className="focus-ring flex-1 rounded-lg border border-slate-700 bg-panelAlt px-3 py-2 text-sm"
        />
        <button disabled={loading} className="focus-ring rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-slate-900">
          {loading ? "..." : "Send"}
        </button>
      </form>
    </section>
  );
}
