import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are FocusForge Linux Coach.
Rules:
- Keep responses short and practical.
- Include one command example.
- Offer one immediate next step.
- Friendly mentor tone.`;

async function openAIReply(userPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_output_tokens: 220
    })
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { output_text?: string };
  return data.output_text ?? null;
}

function mockReply(prompt: string) {
  if (prompt.toLowerCase().includes("chmod")) {
    return "`chmod` changes file permissions. Example: `chmod 640 notes.txt` gives read/write to owner and read-only to group. Next step: run `ls -l` before and after to verify.";
  }
  if (prompt.toLowerCase().includes("quiz")) {
    return "Quick Linux quiz:\n1) Which command shows current directory?\n2) Which flag recursively copies folders with cp?\n3) What does `chmod 755` mean?\nNext step: answer in terminal notes.";
  }
  return "Try this RHCSA mini task: create user `intern1`, group `ops`, add user to group, then verify with `id intern1`. Next step: write each command before executing.";
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { prompt?: string; selectedTrack?: string };
  const prompt = `${body.selectedTrack ?? "linux"} track context: ${body.prompt ?? ""}`;

  const reply = (await openAIReply(prompt)) ?? mockReply(prompt);
  return NextResponse.json({ reply, mode: process.env.OPENAI_API_KEY ? "openai" : "mock" });
}
