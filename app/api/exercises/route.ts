import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const exercises = await prisma.exercise.findMany({
      orderBy: { muscleGroup: "asc" },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, muscleGroup, notes } = body;

    if (!name || !muscleGroup) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        notes,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 });
  }
}
