import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { exerciseId } = body;

    if (!exerciseId) {
      return NextResponse.json({ error: "Missing exerciseId" }, { status: 400 });
    }

    const exercise = await prisma.workoutExercise.create({
      data: {
        workoutId: params.id,
        exerciseId,
      },
      include: {
        exercise: true,
        sets: true,
      },
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add exercise" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const exercises = await prisma.workoutExercise.findMany({
      where: { workoutId: params.id },
      include: {
        exercise: true,
        sets: true,
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}
