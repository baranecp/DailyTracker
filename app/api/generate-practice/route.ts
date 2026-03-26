import { NextRequest, NextResponse } from "next/server";

function mockTask() {
  return "Practice Challenge (10 min): Create user `trainee2`, create group `support`, add the user to the group, create `/tmp/support`, set group ownership to support, and set permissions so only owner/group can access.";
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { level?: string };
  const level = body.level ?? "beginner";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ task: mockTask(), mode: "mock" });
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: `Generate one ${level} Linux challenge that takes 5-15 minutes. Include objective, commands, expected result.`,
      max_output_tokens: 180
    })
  });

  const data = (await res.json()) as { output_text?: string };
  return NextResponse.json({ task: data.output_text ?? mockTask(), mode: "openai" });
}
