import { generateTravelPlan } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answers } = await req.json();
  
  try {
    const plan = await generateTravelPlan(answers);
    if (!plan) return NextResponse.error();
    return NextResponse.json({ plan });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}