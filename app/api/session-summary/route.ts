import { NextRequest, NextResponse } from "next/server";

function mockSummary(track: string, task: string) {
  return `Session Summary\n- Practiced: ${track} on ${task}.\n- Feedback: Good consistency. Keep commands small and repeatable.\n- Next Step: Do one related 10-minute challenge tomorrow.`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { track?: string; task?: string; minutes?: number };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ summary: mockSummary(body.track ?? "linux", body.task ?? "task"), mode: "mock" });
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: `Create a short session summary with: what practiced, feedback, next step. Track: ${body.track}. Task: ${body.task}. Minutes: ${body.minutes}.`,
      max_output_tokens: 150
    })
  });

  const data = (await res.json()) as { output_text?: string };
  return NextResponse.json({ summary: data.output_text ?? mockSummary(body.track ?? "linux", body.task ?? "task"), mode: "openai" });
}
