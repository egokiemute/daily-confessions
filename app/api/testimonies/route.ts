import { NextResponse } from "next/server";
import { createTestimony, getPublicTestimonies, parseTestimonyInput } from "@/app/lib/testimonies";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const testimonies = await getPublicTestimonies();
    return NextResponse.json({ testimonies });
  } catch {
    return NextResponse.json(
      { error: "Unable to load testimonies right now." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = parseTestimonyInput(payload);
    const testimony = await createTestimony(input);

    return NextResponse.json({ testimony }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save testimony right now.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
